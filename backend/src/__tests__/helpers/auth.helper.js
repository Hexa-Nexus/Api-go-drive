const jwt = require('jsonwebtoken');

/**
 * Generate a mock JWT token for testing
 * @param {Object} user - User data to include in the token
 * @returns {string} - JWT token
 */
const generateMockToken = (user = { id: 'mock-user-id', admin: false }) => {
  return jwt.sign(user, process.env.JWT_SECRET || 'secreta', { expiresIn: '1d' });
};

/**
 * Create authorization headers for tests
 * @param {string} token - JWT token
 * @returns {Object} - Headers object with Authorization
 */
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`
});

module.exports = {
  generateMockToken,
  getAuthHeaders
};
