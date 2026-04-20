import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export async function create(userData) {
    const { email, hashed_password, timezone } = userData;

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
            hashed_password,
            sums_used: 0,
            timezone: timezone || 'UTC'
        });
        const returnedValues = {
            id: user.id,
            email: user.email,
            sums_used: user.sums_used,
            timezone: user.timezone
        }
        return returnedValues;
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
        return user ? {
            id: user.id,
            email: user.email,
            sums_used: user.sums_used,
            timezone: user.timezone
        } : null;
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
        return user ? {
            id: user.id,
            email: user.email,
            sums_used: user.sums_used,
            timezone: user.timezone
        } : null;
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

    const { email, password, hashed_password, sums_used, timezone } = updateData;
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

    if (sums_used !== undefined) {
        if (!Number.isInteger(sums_used) || sums_used < 0) {
            throw new Error('sums_used must be a non-negative integer');
        }
        updateFields.sums_used = sums_used;
    }

    if (timezone) {
        updateFields.timezone = timezone.trim();
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
            attributes: ['id', 'email', 'sums_used', 'timezone']
        });
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            sums_used: updatedUser.sums_used,
            timezone: updatedUser.timezone
        };
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

        await user.destroy();
        return {
            id: user.id,
            email: user.email
        };
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
        return user ? user.email : null;
    }
    catch (error) {
        throw new Error(`Failed to find user email: ${error.message}`);
    }
}

// Function for finding users in database.
export async function findAll(limit = 1000, offset = 0) {
    try {
        const users = await User.findAll({
            limit: limit,
            offset: offset,
            attributes: ['id', 'email', 'sums_used', 'timezone']
        });
        return users.map(user => ({
            id: user.id,
            email: user.email,
            sums_used: user.sums_used,
            timezone: user.timezone
        }));
    }
    catch (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
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

        return {
            id: user.id,
            email: user.email,
            sums_used: user.sums_used,
            timezone: user.timezone
        };
    }
    catch (error) {
        if (error.message === 'Invalid credentials') {
            throw error;
        }
        throw new Error(`Failed to authenticate user: ${error.message}`);
    }
}

export async function findTimezoneById(id) {
    if (!id || isNaN(id)) {
        throw new Error('Valid user ID is required');
    }

    try {
        const user = await User.findByPk(parseInt(id), {
            attributes: ['timezone']
        });
        return user ? user.timezone : 'UTC';
    }
    catch (error) {
        throw new Error(`Failed to find user timezone: ${error.message}`);
    }
}