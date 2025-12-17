import { extractTokenFromHeaders, verifyToken } from './jwtHelpers.js';

export const getAuthenticatedUser = (req) => {
	const token = extractTokenFromHeaders(req.headers);
	if (!token) {
		return null;
	}

	const decoded = verifyToken(token);
	if (!decoded) {
		return null;
	}

	// Return user info from token
	return {
		id: decoded.id,
		email: decoded.email,
		first_name: decoded.first_name,
		last_name: decoded.last_name
	};
};