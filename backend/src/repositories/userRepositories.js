import User from '../models/userModel.js';
import { Op } from 'sequelize';

// Create a new user
export async function create(userData) {
    const { email, hashed_password } = userData;

    try {
        const user = await User.create({
            email,
            hashed_password
        });
        return user.dataValues;
    }
    catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }
}

// Find user by ID
export async function findById(id) {
    try {
        const user = await User.findByPk(id);
        return user ? user.dataValues : null;
    }
    catch (error) {
        throw new Error(`Failed to find user: ${error.message}`);
    }
}

// Find user by email
export async function findByEmail(email) {
    try {
        const user = await User.findOne({
            where: { email }
        });
        return user ? user.dataValues : null;
    }
    catch (error) {
        throw new Error(`Failed to find user by email: ${error.message}`);
    }
}

// Find all users (excludes password)
export async function findAll(limit = 50) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email'], // Exclude password
            order: [['id', 'ASC']],
            limit: limit
        });
        return users.map(user => user.dataValues);
    }
    catch (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    }
}

// Update user by ID
export async function updateById(id, updateData) {
    try {
        const [updatedRowsCount] = await User.update(updateData, {
            where: { id },
            returning: true
        });

        if (updatedRowsCount === 0) {
            return null;
        }

        const updatedUser = await User.findByPk(id, {
            attributes: ['id', 'email'] // Exclude password from response
        });
        return updatedUser.dataValues;
    }
    catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
    }
}

// Delete user by ID
export async function deleteById(id) {
    try {
        const user = await User.findByPk(id, {
            attributes: ['id', 'email'] // Exclude password
        });
        if (!user) {
            return null;
        }

        const userData = user.dataValues;
        await user.destroy();
        return userData;
    }
    catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
    }
}

// Find user email by ID
export async function findEmailById(id) {
    try {
        const user = await User.findByPk(id, {
            attributes: ['email']
        });
        return user ? user.dataValues.email : null;
    }
    catch (error) {
        throw new Error(`Failed to find user email: ${error.message}`);
    }
}