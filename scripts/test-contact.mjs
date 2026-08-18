fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_name: 'Test User',
    user_email: 'test@example.com',
    message: 'This is a test message.',
    intent: 'conversation'
  })
}).then(async res => {
  console.log(res.status);
  const text = await res.text();
  console.log(text);
}).catch(console.error);
