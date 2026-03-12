export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const logout = (): void => {
    localStorage.removeItem('authToken');
};

// Simple token decoding
export const decodeToken = (token: string) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch {
        return null;
    }
};

// Check if token is valid
export const isTokenValid = (): boolean => {
    const token = getToken();
    if (!token) return false;

    const decoded = decodeToken(token);
    if (!decoded) return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
};

// Get auth headers for API calls
export const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get authentication state
export const checkAuth = () => {
    if (isTokenValid()) {
        const token = getToken();
        const userData = token ? decodeToken(token) : null;
        return {
            isAuthenticated: true,
            user: userData
        };
    } else {
        return {
            isAuthenticated: false,
            user: null
        };
    }
};