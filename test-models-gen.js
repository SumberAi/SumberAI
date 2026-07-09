async function run() {
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AQ.Ab8RN6K54NhdTIcpf7HINwA4opxbd6pz8Yz3uLlpM3PH-Bobgw");
  const data = await r.json();
  const names = data.models.filter(m => m.supportedGenerationMethods?.includes('generateContent')).map(m => m.name);
  console.log(names);
}
run();
