import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export async function create(userData) {
    const { email, hashed_password } = userData;

    if (!email || !hashed_password) {
        throw new Error('Email and password are required');
    }

    const existingUser = await User.findOne({
        where: { email }
    });
    
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    try {
        const user = await User.create({
            email: email.trim(),
            hashed_password
        });
        return user.dataValues;
    }
    catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }
}

export async function findById(id) {
    if (!id || isNaN(id)) {
        throw new Error('Valid user ID is required');
    }

    try {
        const user = await User.findByPk(parseInt(id));
        return user ? user.dataValues : null;
    }
    catch (error) {
        throw new Error(`Failed to find user: ${error.message}`);
    }
}

export async function findByEmail(email) {
    if (!email) {
        throw new Error('Email is required');
    }

    try {
        const user = await User.findOne({
            where: { email: email.trim() }
        });
        return user ? user.dataValues : null;
    }
    catch (error) {
        throw new Error(`Failed to find user by email: ${error.message}`);
    }
}

export async function updateById(id, updateData) {
    if (!id || isNaN(id)) {
        throw new Error('Valid user ID is required');
    }

    const existingUser = await User.findByPk(parseInt(id));
    if (!existingUser) {
        throw new Error('User not found');
    }

    const { email, password, hashed_password } = updateData;
    const updateFields = {};

    if (email) {
        const emailUser = await User.findOne({
            where: { email: email.trim() }
        });
        if (emailUser && emailUser.id !== parseInt(id)) {
            throw new Error('Email already in use by another user');
        }
        updateFields.email = email.trim();
    }

    if (password) {
        const saltRounds = 12;
        updateFields.hashed_password = await bcrypt.hash(password, saltRounds);
    } 
    else if (hashed_password) {
        updateFields.hashed_password = hashed_password;
    }

    if (Object.keys(updateFields).length === 0) {
        throw new Error('No valid fields to update');
    }

    try {
        const [updatedRowsCount] = await User.update(updateFields, {
            where: { id: parseInt(id) },
            returning: true
        });

        if (updatedRowsCount === 0) {
            return null;
        }

        const updatedUser = await User.findByPk(parseInt(id), {
            attributes: ['id', 'email']
        });
        return updatedUser.dataValues;
    }
    catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
    }
}

export async function deleteById(id) {
    if (!id || isNaN(id)) {
        throw new Error('Valid user ID is required');
    }

    try {
        const user = await User.findByPk(parseInt(id), {
            attributes: ['id', 'email']
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

export async function findEmailById(id) {
    if (!id || isNaN(id)) {
        throw new Error('Valid user ID is required');
    }

    try {
        const user = await User.findByPk(parseInt(id), {
            attributes: ['email']
        });
        return user ? user.dataValues.email : null;
    }
    catch (error) {
        throw new Error(`Failed to find user email: ${error.message}`);
    }
}

export async function count() {
    try {
        const totalUsers = await User.count();
        return totalUsers;
    }
    catch (error) {
        throw new Error(`Failed to count users: ${error.message}`);
    }
}

export async function authenticate(email, password) {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    try {
        const user = await User.findOne({
            where: { email: email.trim() }
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        return user.dataValues;
    }
    catch (error) {
        if (error.message === 'Invalid credentials') {
            throw error;
        }
        throw new Error(`Failed to authenticate user: ${error.message}`);
    }
}