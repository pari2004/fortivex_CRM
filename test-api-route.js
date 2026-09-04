fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{role: 'user', content: 'test'}] })
}).then(async r => {
  console.log(r.status);
  console.log(await r.text());
});
