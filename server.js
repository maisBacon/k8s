import 'newrelic';
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {

  console.log('Request received');
  res.json({
    message: 'Hello from Kubernetes!!!! TESTING 123',
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname()
  });
});

app.get('/health', (req, res) => {
  console.log('Health check received');
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

