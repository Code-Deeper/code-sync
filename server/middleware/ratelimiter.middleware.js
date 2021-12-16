const rateLimit = require('express-rate-limit');

const rateLimiter = ({ windowMs, max, message }) => {
  return rateLimit({ windowMs, max, message });
};
module.exports = rateLimiter;
