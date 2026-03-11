import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepositories.js';
import { generateToken } from '../utils/jwtUtils.js';

// Create a new user
export async function createUser(email, password) {
    try {
        // Validation
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Check if user already exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const saltRounds = 12;
        const hashed_password = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = await userRepository.create({
            email,
            hashed_password
        });

        // Return user without password
        const { hashed_password: _, ...userResponse } = user;
        return userResponse;

    }
    catch (error) {
        throw error;
    }
}

// Get user by ID
export async function getUserById(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('Valid user ID is required');
        }

        const user = await userRepository.findById(parseInt(id));

        if (!user) {
            throw new Error('User not found');
        }

        // Remove password from response
        const { hashed_password: _, ...userResponse } = user;
        return userResponse;

    }
    catch (error) {
        throw error;
    }
}

// Get user by email (for internal use)
export async function getUserByEmail(email) {
    try {
        if (!email) {
            throw new Error('Email is required');
        }

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new Error('User not found');
        }

        // Remove password from response
        const { hashed_password: _, ...userResponse } = user;
        return userResponse;

    }
    catch (error) {
        throw error;
    }
}

// Get all users
export async function getAllUsers(limit = 50) {
    try {
        if (limit && (isNaN(limit) || limit < 1)) {
            throw new Error('Limit must be a positive number');
        }

        const users = await userRepository.findAll(limit);
        const totalUsers = await userRepository.count();

        return {
            users,
            meta: {
                total: totalUsers,
                count: users.length,
                limit
            }
        };

    }
    catch (error) {
        throw error;
    }
}

// Update user
export async function updateUser(id, updateData) {
    try {
        const { email, password } = updateData;

        if (!id || isNaN(id)) {
            throw new Error('Valid user ID is required');
        }

        // Check if user exists
        const existingUser = await userRepository.findById(parseInt(id));
        if (!existingUser) {
            throw new Error('User not found');
        }

        const updateFields = {};

        // Check if email is being updated
        if (email) {
            // Check if new email already exists for another user
            const emailUser = await userRepository.findByEmail(email);
            if (emailUser && emailUser.id !== parseInt(id)) {
                throw new Error('Email already in use by another user');
            }
            updateFields.email = email;
        }

        // Check if password is being updated
        if (password) {
            const saltRounds = 12;
            updateFields.hashed_password = await bcrypt.hash(password, saltRounds);
        }

        if (Object.keys(updateFields).length === 0) {
            throw new Error('No valid fields to update');
        }

        const updatedUser = await userRepository.updateById(parseInt(id), updateFields);
        return updatedUser;

    }
    catch (error) {
        throw error;
    }
}

// Delete user
export async function deleteUser(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('Valid user ID is required');
        }

        const deletedUser = await userRepository.deleteById(parseInt(id));

        if (!deletedUser) {
            throw new Error('User not found');
        }

        return deletedUser;

    }
    catch (error) {
        throw error;
    }
}

// Login user (authenticate)
export async function authenticateUser(email, password) {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Remove password from response
        const { hashed_password: _, ...userResponse } = user;

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email
        });

        return {
            user: userResponse,
            token
        };

    } 
    catch (error) {
        throw error;
    }
}