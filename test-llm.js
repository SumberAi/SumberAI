async function run() {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AQ.Ab8RN6K54NhdTIcpf7HINwA4opxbd6pz8Yz3uLlpM3PH-Bobgw";
  const payload = {
    contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
  };
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
