import jwt from 'jsonwebtoken';

const JWT_SECRET = 'my-super-duper-secret-secret';
const JWT_EXPIRATION = '7d';

export const generateToken = (user) => {
    const payload = {
        id: user._id.toString(),
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION
    });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
};

export const extractTokenFromHeaders = (headers) => {
    const authHeader = headers.authorization || headers.Authorization;
    
    if (!authHeader) {
        return null;
    }

    // Support both "Bearer TOKEN" and just "TOKEN"
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    
    return authHeader;
};