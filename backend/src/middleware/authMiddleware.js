import { verifyToken } from '../utils/jwtUtils.js';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access token is required'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } 
    catch (error) {
        return res.status(403).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
}

// Optional: Middleware to check if user exists in database
export function requireUser(req, res, next) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            error: 'User authentication required'
        });
    }
    next();
}