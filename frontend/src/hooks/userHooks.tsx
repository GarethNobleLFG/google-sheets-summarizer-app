// User Registration
export const createUser = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    // Store the token in localStorage
    if (data.data.token) {
        localStorage.setItem('authToken', data.data.token);
    }
    
    return data.data;
};

// User Login
export const loginUser = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    // Store the token in localStorage
    if (data.data.token) {
        localStorage.setItem('authToken', data.data.token);
    }

    return data.data;
};

// Get All Users
export const getAllUsers = async (limit?: number, token?: string) => {
    const url = limit ? `http://localhost:3000/users?limit=${limit}` : 'http://localhost:3000/users';
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Get User By ID
export const getUserById = async (id: string | number, token?: string) => {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Get User By Email
export const getUserByEmail = async (email: string, token?: string) => {
    const response = await fetch(`http://localhost:3000/users/email/${email}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Update User
export const updateUser = async (id: string | number, updateData: { email?: string; password?: string }, token?: string) => {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Delete User
export const deleteUser = async (id: string | number, token?: string) => {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};