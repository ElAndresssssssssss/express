/**
 * @file middleware/logger.js
 * @description Request logger middleware. Logs the timestamp, HTTP method, URL, and
 * client IP on every incoming request, then logs the response status code and
 * duration in ms once the response finishes.
 */
const LoggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp} ${req.method} ${req.url} - IP: ${req.ip}]`);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] Response: ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = LoggerMiddleware;