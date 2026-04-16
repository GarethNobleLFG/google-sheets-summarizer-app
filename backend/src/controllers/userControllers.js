import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepositories.js';
import { generateToken } from '../utils/jwtUtils.js';
import { convertForTimezone } from '../services/sheet-data-services/convertForTimezone.js';

export async function createUser(req, res) {
    try {
        const { email, password, timezone } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const saltRounds = 12;
        const hashed_password = await bcrypt.hash(password, saltRounds);

        const user = await userRepository.create({
            email,
            hashed_password,
            timezone
        });

        const { hashed_password: _, ...userResponse } = user;

        const token = generateToken({
            id: user.id,
            email: user.email
        });

        res.status(201).json({
            success: true,
            data: {
                user: userResponse,
                token
            },
            message: 'User created successfully'
        });

    }
    catch (error) {
        console.error('Error creating user:', error);

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

export async function getUserById(req, res) {
    try {
        const { id } = req.params;

        const user = await userRepository.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const { hashed_password: _, ...userResponse } = user;

        res.status(200).json({
            success: true,
            data: userResponse
        });

    }
    catch (error) {
        console.error('Error fetching user:', error);

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

export async function getUserByEmail(req, res) {
    try {
        const { email } = req.params;

        const user = await userRepository.findByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const { hashed_password: _, ...userResponse } = user;

        res.status(200).json({
            success: true,
            data: userResponse
        });

    }
    catch (error) {
        console.error('Error fetching user by email:', error);

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

export async function getAllUsers(req, res) {
    try {
        const { limit } = req.query;
        const userLimit = limit ? parseInt(limit) : undefined;

        const users = await userRepository.findAll(userLimit);
        const totalUsers = await userRepository.count();

        res.status(200).json({
            success: true,
            data: users,
            meta: {
                total: totalUsers,
                count: users.length,
                limit: userLimit || 50
            }
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

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const {
            email,
            password,
            sumsUsed,
            sums_used,
            timeZone,
            timezone
        } = req.body;

        // Build update data object with correct field names for repository
        const updateData = {};
        if (email !== undefined) updateData.email = email;
        if (password !== undefined) updateData.password = password;
        if (sumsUsed !== undefined) updateData.sums_used = sumsUsed;
        if (sums_used !== undefined) updateData.sums_used = sums_used;
        if (timeZone !== undefined) updateData.timezone = timeZone;
        if (timezone !== undefined) updateData.timezone = timezone;

        const updatedUser = await userRepository.updateById(id, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

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

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const deletedUser = await userRepository.deleteById(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: deletedUser,
            message: 'User deleted successfully'
        });

    }
    catch (error) {
        console.error('Error deleting user:', error);

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

export async function loginUser(req, res) {
    try {
        const { email, password, timezone } = req.body;

        const user = await userRepository.authenticate(email, password);

        if (timezone && timezone !== user.timezone) {
            await userRepository.updateById(user.id, { timezone });
            user.timezone = timezone;

            try {
                await convertForTimezone(user.id);
            }
            catch (conversionError) {
                console.error('Timezone conversion failed:', conversionError.message);
            }
        }

        const { hashed_password: _, ...userResponse } = user;

        const token = generateToken({
            id: user.id,
            email: user.email
        });

        res.status(200).json({
            success: true,
            data: {
                user: userResponse,
                token: token
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