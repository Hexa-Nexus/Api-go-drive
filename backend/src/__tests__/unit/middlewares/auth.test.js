const jwt = require('jsonwebtoken');
const verificarJWT = require('../../../middlewares/auth');
const { generateMockToken } = require('../../helpers/auth.helper');

// Mock jwt
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next() when token is valid', () => {
    // Arrange
    const token = generateMockToken();
    req.headers.authorization = `Bearer ${token}`;

    const mockDecodedToken = { id: 'mock-user-id', admin: false };
    jwt.verify.mockReturnValue(mockDecodedToken);

    // Act
    verificarJWT(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
    expect(req.user).toEqual(mockDecodedToken);
    expect(next).toHaveBeenCalled();
  });

  it('should accept token without Bearer prefix', () => {
    // Arrange
    const token = generateMockToken();
    req.headers.authorization = token;

    const mockDecodedToken = { id: 'mock-user-id', admin: false };
    jwt.verify.mockReturnValue(mockDecodedToken);

    // Act
    verificarJWT(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
    expect(req.user).toEqual(mockDecodedToken);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 when no token is provided', () => {
    // Arrange
    req.headers.authorization = undefined;

    // Act
    verificarJWT(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    // Arrange
    const token = 'invalid-token';
    req.headers.authorization = `Bearer ${token}`;

    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act
    verificarJWT(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado!' });
    expect(next).not.toHaveBeenCalled();
  });
});
