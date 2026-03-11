import * as userService from '../services/userServices.js';

// Create a new user
export async function createUser(req, res) {
    try {
        const { email, password } = req.body;
        
        const user = await userService.createUser(email, password);
        
        res.status(201).json({
            success: true,
            data: user,
            message: 'User created successfully'
        });
        
    } 
    catch (error) {
        console.error('Error creating user:', error);
        
        // Handle specific errors with appropriate status codes
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                error: error.message
            });
        }
        
        if (error.message.includes('required')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// Get user by ID
export async function getUserById(req, res) {
    try {
        const { id } = req.params;
        
        const user = await userService.getUserById(id);
        
        res.status(200).json({
            success: true,
            data: user
        });
        
    } 
    catch (error) {
        console.error('Error fetching user:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        
        if (error.message.includes('required') || error.message.includes('Valid')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// Get user by email
export async function getUserByEmail(req, res) {
    try {
        const { email } = req.params;
        
        const user = await userService.getUserByEmail(email);
        
        res.status(200).json({
            success: true,
            data: user
        });
        
    } 
    catch (error) {
        console.error('Error fetching user by email:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        
        if (error.message.includes('required')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// Get all users
export async function getAllUsers(req, res) {
    try {
        const { limit } = req.query;
        const userLimit = limit ? parseInt(limit) : undefined;
        
        const result = await userService.getAllUsers(userLimit);
        
        res.status(200).json({
            success: true,
            data: result.users,
            meta: result.meta
        });
        
    } 
    catch (error) {
        console.error('Error fetching all users:', error);
        
        if (error.message.includes('positive number')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// Update user
export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedUser = await userService.updateUser(id, updateData);
        
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'User updated successfully'
        });
        
    } 
    catch (error) {
        console.error('Error updating user:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        
        if (error.message.includes('already in use')) {
            return res.status(409).json({
                success: false,
                error: error.message
            });
        }
        
        if (error.message.includes('required') || error.message.includes('No valid fields')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// Delete user
export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        
        const deletedUser = await userService.deleteUser(id);
        
        res.status(200).json({
            success: true,
            data: deletedUser,
            message: 'User deleted successfully'
        });
        
    } 
    catch (error) {
        console.error('Error deleting user:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        
        if (error.message.includes('required')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// Authenticate user (login)
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        
        const result = await userService.authenticateUser(email, password);
        
        res.status(200).json({
            success: true,
            data: {
                user: result.user,
                token: result.token
            },
            message: 'Login successful'
        });
        
    } 
    catch (error) {
        console.error('Error during login:', error);
        
        if (error.message.includes('Invalid credentials')) {
            return res.status(401).json({
                success: false,
                error: error.message
            });
        }
        
        if (error.message.includes('required')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}