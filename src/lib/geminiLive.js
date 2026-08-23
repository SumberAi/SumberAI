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
    this.disconnected = false;
  }

  async connect(systemInstruction = '') {
    this.systemInstruction = systemInstruction + '\n\nIMPORTANT: You must return a valid JSON object exactly in this format: { "user_transcript": "exact text of what the user said in their language", "ai_response": "your response to the user", "ai_translation": "Indonesian translation of your ai_response" }.';
    this.history = [];
    return Promise.resolve();
  }

  async sendClientContent(textMessage = null, base64Audio = null, mimeType = 'audio/webm') {
    const userParts = [];
    
    if (textMessage) userParts.push({ text: textMessage });
    if (base64Audio) {
      userParts.push({ inlineData: { mimeType: mimeType, data: base64Audio } });
    }
    if (userParts.length === 0) userParts.push({ text: 'Hello' });

    this.history.push({ role: 'user', parts: userParts });

    try {
      let baseUrl = import.meta.env.VITE_API_URL || 'https://app.sumberai.id';
      const isNative = typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.();
      if (!isNative) {
         baseUrl = '';
      }
      const llmUrl = `${baseUrl}/api/generate`;
      const llmPayload = {
        systemInstruction: { parts: [{ text: this.systemInstruction }] },
        contents: this.history,
        generationConfig: { responseMimeType: 'application/json' }
      };

      const llmRes = await fetch(llmUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(llmPayload) });
      const llmData = await llmRes.json();
      
      if (this.disconnected) return;

      let aiText = '';
      let ttsText = '';
      if (llmData.candidates && llmData.candidates[0].content) {
        const rawJson = llmData.candidates[0].content.parts.map(p => p.text).join(' ');
        let cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        try {
          const parsed = JSON.parse(cleanJson);
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
        let errorMsg = 'Error tidak diketahui dari server.';
        if (llmData.error) {
           errorMsg = typeof llmData.error === 'string' ? llmData.error : llmData.error.message || JSON.stringify(llmData.error);
        }
        alert('Oops! Gagal menyambung ke AI. Alasan: ' + errorMsg);
        
        if (this.onTurnComplete) this.onTurnComplete();
        return;
      }

      // 🛡️ BUG FIX: Selalu hapus rekaman suara (audio payload) dari history apapun yang terjadi, 
      // agar tidak terkirim ulang berkali-kali dan menyedot puluhan ribu token.
      try {
        const rawJson = llmData.candidates[0].content.parts.map(p => p.text).join(' ');
        const cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        this.history[this.history.length - 1] = { role: 'user', parts: [{ text: parsed.user_transcript || '...' }] };
      } catch(e) {
        // Jika AI merespon dengan format yang kacau dan JSON gagal dibaca, 
        // TETAP HAPUS data audionya dan ganti dengan teks dummy!
        this.history[this.history.length - 1] = { role: 'user', parts: [{ text: '...' }] };
      }
      
      this.history.push({ role: 'model', parts: [{ text: ttsText }] });
      
      // Generate and play audio first
      await this.speak(ttsText);

      // Show text right when the audio is ready to play
      if (this.onText) {
        this.onText(aiText);
      }
    } catch (err) {
      console.error('REST API Error:', err);
    } finally {
      if (this.onTurnComplete) this.onTurnComplete();
    }
  }

  async speak(text, uiTextToDisplay = null) {
    if (!text || this.disconnected) return;
    try {
      let baseUrl = import.meta.env.VITE_API_URL || 'https://app.sumberai.id';
      const isNative = typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.();
      if (!isNative) {
         baseUrl = '';
      }
      const ttsUrl = `${baseUrl}/api/tts`;
      const ttsPayload = {
        contents: [{ role: 'user', parts: [{ text: 'Please read this text aloud exactly as written, do not answer it or generate new text: ' + text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: this.voiceName } } }
        }
      };

      const ttsRes = await fetch(ttsUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ttsPayload) });
      const ttsData = await ttsRes.json();

      if (this.disconnected) return;

      if (ttsData.candidates && ttsData.candidates[0].content) {
        const outParts = ttsData.candidates[0].content.parts;
        for (const part of outParts) {
          if (part.inlineData && part.inlineData.mimeType.includes('audio') && this.onAudioChunk) {
            this.onAudioChunk(part.inlineData.data);
          }
        }
      } else if (ttsData.error) {
         console.error('TTS API Error:', ttsData.error);
         const errorMsg = typeof ttsData.error === 'string' ? ttsData.error : ttsData.error.message || JSON.stringify(ttsData.error);
         alert("Gagal memuat suara AI (Mungkin limit API tercapai): " + errorMsg);
         if (this.audioStreamer.onAudioStateChange) {
            this.audioStreamer.onAudioStateChange(false);
         }
      } else {
         console.error('Unknown TTS Response:', ttsData);
         alert("Terjadi kesalahan sistem dari server AI. Silakan coba lagi.");
         if (this.audioStreamer.onAudioStateChange) {
            this.audioStreamer.onAudioStateChange(false);
         }
      }
    } catch (err) {
      console.error('TTS Error:', err);
      alert("TTS Error: " + err.message);
      if (this.audioStreamer.onAudioStateChange) {
         this.audioStreamer.onAudioStateChange(false);
      }
    }
  }

  disconnect() {
    this.disconnected = true;
    if (this.audioStreamer) {
      this.audioStreamer.stopRecording();
      this.audioStreamer.stopAudio();
    }
  }

  initializeAudio() {
    this.audioStreamer.resumeContext();
  }

  async startListening() {
    await this.audioStreamer.startRecording();
  }

  async stopListening() {
    const recordResult = await this.audioStreamer.stopRecording();
    if (recordResult && recordResult.base64) {
      await this.sendClientContent(null, recordResult.base64, recordResult.mimeType);
    } else {
      await this.sendClientContent('...');
    }
  }
}

let globalAudioCtx = null;

export class AudioStreamer {
  constructor(onAudioStateChange) {
    this.onAudioStateChange = onAudioStateChange;
    this.audioCtx = null;
    this.nextPlayTime = 0;
    this.activeSources = 0;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.playingSourcesList = [];
  }

  resumeContext() {
    if (!globalAudioCtx) {
      globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    }
    this.audioCtx = globalAudioCtx;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  async startRecording() {
    this.audioChunks = [];
    try {
      if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      }
      this.audioCtx = globalAudioCtx;
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }
      this.nextPlayTime = this.audioCtx.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
      
      // Deteksi otomatis format audio yang didukung browser (iOS vs Android)
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
         options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
         options = { mimeType: 'audio/mp4' };
      }
      
      this.mediaRecorder = new MediaRecorder(stream, options);
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
          const actualMimeType = this.mediaRecorder.mimeType || 'audio/webm';
          const blob = new Blob(this.audioChunks, { type: actualMimeType });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result.split(',')[1];
            resolve({ base64: base64data, mimeType: actualMimeType });
          };
        };
        this.mediaRecorder.stop();
      } else {
        resolve(null);
      }
    });
  }

  playAudioChunk(base64Data) {
    if (!globalAudioCtx) {
      globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    }
    this.audioCtx = globalAudioCtx;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.nextPlayTime === 0 || this.nextPlayTime < this.audioCtx.currentTime) {
      this.nextPlayTime = this.audioCtx.currentTime;
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
    this.playingSourcesList.push(source);
    
    source.onended = () => {
      this.playingSourcesList = this.playingSourcesList.filter(s => s !== source);
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
  
  stopAudio() {
    // We no longer close the global context, just suspend it if needed, or do nothing.
    // Let's just clear our local state and explicitly stop all currently playing nodes.
    if (this.playingSourcesList) {
      this.playingSourcesList.forEach(source => {
        try { source.stop(); } catch (e) {}
      });
      this.playingSourcesList = [];
    }
    this.nextPlayTime = 0;
    this.activeSources = 0;
    if (this.onAudioStateChange) this.onAudioStateChange(false);
  }
}
