export class GeminiLiveClient {
  constructor(apiKey, onText, onAudioChunk, onTurnComplete, onUserTranscript, onAudioStateChange, voiceName = 'Aoede') {
    this.apiKey = apiKey;
    this.onText = onText;
    this.onAudioChunk = onAudioChunk;
    this.onTurnComplete = onTurnComplete;
    this.onUserTranscript = onUserTranscript;
    this.voiceName = voiceName;
    this.audioStreamer = new AudioStreamer(onAudioStateChange);
    this.systemInstruction = '';
    this.history = [];
  }

  async connect(systemInstruction = '') {
    this.systemInstruction = systemInstruction + '\n\nIMPORTANT: You must return a valid JSON object exactly in this format: { "user_transcript": "exact text of what the user said in their language", "ai_response": "your response to the user", "ai_translation": "Indonesian translation of your ai_response" }.';
    this.history = [];
    return Promise.resolve();
  }

  async sendClientContent(textMessage = null, base64Audio = null, mimeType = 'audio/webm') {
    const userParts = [];
    
    if (textMessage) userParts.push({ text: textMessage });
    if (base64Audio) userParts.push({ inlineData: { mimeType: mimeType, data: base64Audio } });
    if (userParts.length === 0) userParts.push({ text: 'Hello' });

    this.history.push({ role: 'user', parts: userParts });

    try {
      const llmUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      const llmPayload = {
        systemInstruction: { parts: [{ text: this.systemInstruction }] },
        contents: this.history,
        generationConfig: { responseMimeType: 'application/json' }
      };

      const llmRes = await fetch(llmUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(llmPayload) });
      const llmData = await llmRes.json();
      
      let aiText = '';
      let ttsText = '';
      if (llmData.candidates && llmData.candidates[0].content) {
        const rawJson = llmData.candidates[0].content.parts.map(p => p.text).join(' ');
        try {
          const parsed = JSON.parse(rawJson);
          if (parsed.user_transcript && this.onUserTranscript) {
             this.onUserTranscript(parsed.user_transcript, true);
          }
          
          let rawAiResp = parsed.ai_response || rawJson;
          // Clean up any stray language tags that the AI might still output
          rawAiResp = rawAiResp.replace(/^\[([a-z]{2}-[A-Z]{2})\]\s*/i, '');
          
          ttsText = rawAiResp;
          aiText = rawAiResp;
          if (parsed.ai_translation) {
             aiText += "\n\n*Terjemahan: " + parsed.ai_translation + "*";
          }
        } catch(e) {
          aiText = rawJson;
          ttsText = rawJson;
        }
      } else {
        console.error('LLM API Error:', llmData);
        if (this.onTurnComplete) this.onTurnComplete();
        return;
      }

      try {
        const parsed = JSON.parse(llmData.candidates[0].content.parts.map(p => p.text).join(' '));
        this.history[this.history.length - 1] = { role: 'user', parts: [{ text: parsed.user_transcript || '...' }] };
      } catch(e) {}
      
      this.history.push({ role: 'model', parts: [{ text: ttsText }] });
      
      await this.speak(ttsText, aiText);
    } catch (err) {
      console.error('REST API Error:', err);
    } finally {
      if (this.onTurnComplete) this.onTurnComplete();
    }
  }

  async speak(text, uiTextToDisplay = null) {
    if (!text) return;
    try {
      const ttsUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${this.apiKey}`;
      const ttsPayload = {
        contents: [{ role: 'user', parts: [{ text: text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: this.voiceName } } }
        }
      };

      const ttsRes = await fetch(ttsUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ttsPayload) });
      const ttsData = await ttsRes.json();

      if (uiTextToDisplay && this.onText) {
        this.onText(uiTextToDisplay);
      }

      if (ttsData.candidates && ttsData.candidates[0].content) {
        const outParts = ttsData.candidates[0].content.parts;
        for (const part of outParts) {
          if (part.inlineData && part.inlineData.mimeType.includes('audio') && this.onAudioChunk) {
            this.onAudioChunk(part.inlineData.data);
          }
        }
      } else if (ttsData.error) {
         console.error('TTS API Error:', ttsData.error);
         if (this.audioStreamer.onAudioStateChange) {
            this.audioStreamer.onAudioStateChange(false);
         }
      }
    } catch (err) {
      console.error('TTS Error:', err);
      if (this.audioStreamer.onAudioStateChange) {
         this.audioStreamer.onAudioStateChange(false);
      }
    }
  }

  disconnect() {
    this.audioStreamer.stopRecording();
  }

  async startListening() {
    await this.audioStreamer.startRecording();
  }

  async stopListening() {
    const base64Audio = await this.audioStreamer.stopRecording();
    if (base64Audio) {
      await this.sendClientContent(null, base64Audio, 'audio/webm');
    } else {
      await this.sendClientContent('...');
    }
  }
}

export class AudioStreamer {
  constructor(onAudioStateChange) {
    this.onAudioStateChange = onAudioStateChange;
    this.audioCtx = null;
    this.nextPlayTime = 0;
    this.activeSources = 0;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  async startRecording() {
    this.audioChunks = [];
    try {
      // WARM UP AUDIO CONTEXT FOR MOBILE SAFARI/CHROME
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      }
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }
      this.nextPlayTime = this.audioCtx.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };
      this.mediaRecorder.start();
    } catch(e) {
      console.error("Mic access denied", e);
      if (!navigator.mediaDevices) {
         alert("MOHON PERHATIAN: Browser Android memblokir mikrofon karena Anda mengakses lewat IP (HTTP) tanpa SSL. Fitur suara wajib menggunakan HTTPS atau diakses lewat localhost.");
      } else {
         alert("Gagal mengakses mikrofon. Pastikan Anda telah mengklik 'Izinkan' (Allow) untuk izin mikrofon di browser Anda.");
      }
    }
    return Promise.resolve();
  }

  stopRecording() {
    return new Promise(resolve => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = async () => {
          this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            resolve(base64data);
          };
        };
        this.mediaRecorder.stop();
      } else {
        resolve(null);
      }
    });
  }

  playAudioChunk(base64Data) {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      this.nextPlayTime = this.audioCtx.currentTime;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const binaryStr = atob(base64Data);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = this.audioCtx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = this.audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioCtx.destination);

    if (this.nextPlayTime < this.audioCtx.currentTime) {
      this.nextPlayTime = this.audioCtx.currentTime;
    }
    source.start(this.nextPlayTime);
    
    source.onended = () => {
      this.activeSources--;
      if (this.activeSources <= 0) {
        this.activeSources = 0;
        if (this.onAudioStateChange) this.onAudioStateChange(false);
      }
    };
    
    const delayBeforeStart = Math.max(0, this.nextPlayTime - this.audioCtx.currentTime);
    setTimeout(() => {
      if (this.activeSources === 0 && this.onAudioStateChange) {
        this.onAudioStateChange(true);
      }
      this.activeSources++;
    }, delayBeforeStart * 1000);
    
    this.nextPlayTime += audioBuffer.duration;
  }
}
