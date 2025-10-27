require('newrelic');
const express = require('express');
const winston = require('winston');
const newrelicFormatter = require('@newrelic/winston-enricher')(winston);

const app = express();
const PORT = 3000;

// Configurar Winston com New Relic integration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    newrelicFormatter(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Middleware para logging de todas as requisições
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      type: 'http_request',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: duration,
      durationMs: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  
  next();
});

app.get('/', (req, res) => {
  logger.info('Root endpoint accessed', {
    hostname: require('os').hostname()
  });

  res.json({
    message: 'Hello from Kubernetes!!!! TESTING 1234',
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname()
  });
});

app.get('/health', (req, res) => {
  logger.debug('Health check received', {
    status: 'healthy'
  });
  
  res.status(200).json({ status: 'healthy' });
});

// Novo endpoint para testar logs de diferentes níveis
app.get('/test-logs', (req, res) => {
  logger.info('Test logs endpoint called - INFO level');
  
  logger.warn('This is a warning log for testing', {
    severity: 'warning',
    testData: { foo: 'bar' }
  });

  logger.error('This is an error log for testing (not a real error)', {
    severity: 'error',
    testData: { error: 'simulated' }
  });

  res.json({
    message: 'Logs sent to New Relic!',
    logsGenerated: ['info', 'warning', 'error'],
    tip: 'Check New Relic Logs UI'
  });
});

// Endpoint para simular erro real
app.get('/error', (req, res) => {
  logger.error('Intentional error triggered', {
    path: req.path,
    errorType: 'simulated'
  });

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'This is a simulated error'
  });
});

// Endpoint para testar diferentes níveis de log
app.get('/log-levels', (req, res) => {
  logger.debug('This is a DEBUG log');
  logger.info('This is an INFO log');
  logger.warn('This is a WARN log');
  logger.error('This is an ERROR log');

  res.json({
    message: 'All log levels tested',
    levels: ['debug', 'info', 'warn', 'error']
  });
});

// Handler de erros global
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info('Server started', {
    port: PORT,
    nodeVersion: process.version,
    platform: process.platform,
    env: process.env.NODE_ENV || 'development'
  });
});

