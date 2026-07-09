fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AQ.Ab8RN6K54NhdTIcpf7HINwA4opxbd6pz8Yz3uLlpM3PH-Bobgw")
  .then(r => r.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
