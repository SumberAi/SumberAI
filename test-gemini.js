fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AQ.Ab8RN6K54NhdTIcpf7HINwA4opxbd6pz8Yz3uLlpM3PH-Bobgw", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
}).then(r => r.text()).then(console.log).catch(console.error);
