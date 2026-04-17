import SheetData from '../models/sheetDataModel.js';
import { Op } from 'sequelize';
import { calculateNextRunTime } from '../utils/calculateNextRunTime.js';
import * as userRepository from './userRepositories.js';
import { DateTime } from 'luxon';

export async function create(sheetDataInput) {
    const { user_id, link, sheet_name, frequency, pre_prompt, post_prompt } = sheetDataInput;

    if (!user_id || !link || !sheet_name || !frequency || !pre_prompt || !post_prompt) {
        throw new Error('User ID, link, sheet name, frequency, pre-prompt, post-prompt are required');
    }

    if (isNaN(user_id)) {
        throw new Error('Valid user ID is required');
    }

    try {
        // Calculate next_run_at from frequency (cron expression)
        let nextRun = null;
        let createdAt = null;

        if (frequency.trim().toLowerCase() !== 'none') {
            const userTimezone = await userRepository.findTimezoneById(user_id);
            nextRun = calculateNextRunTime(frequency.trim(), userTimezone);

            const nowInUserTz = DateTime.now().setZone(userTimezone);
            createdAt = nowInUserTz.toFormat('yyyy-MM-dd HH:mm:ss');
        }

        const createData = {
            user_id: parseInt(user_id),
            link: link.trim(),
            sheet_name: sheet_name.trim(),
            frequency: frequency.trim(),
            pre_prompt: pre_prompt.trim(),
            post_prompt: post_prompt.trim(),
            next_run_at: nextRun
        };

        if (createdAt) {
            createData.created_at = createdAt;
        }

        const sheetData = await SheetData.create(createData);
        return sheetData.dataValues;
    }
    catch (error) {
        if (error.message.includes('Invalid cron expression')) {
            throw new Error(`Invalid cron schedule format: ${error.message}`);
        }
        throw new Error(`Failed to create sheet data: ${error.message}`);
    }
}

export async function findById(id) {
    if (!id || isNaN(id)) {
        throw new Error('Valid sheet data ID is required');
    }

    try {
        const sheetData = await SheetData.findByPk(parseInt(id));
        return sheetData ? sheetData.dataValues : null;
    }
    catch (error) {
        throw new Error(`Failed to find sheet data: ${error.message}`);
    }
}

export async function findAllFromUser(userId, limit = 50) {
    if (!userId || isNaN(userId)) {
        throw new Error('Valid user ID is required');
    }

    if (limit && (isNaN(limit) || limit < 1)) {
        throw new Error('Limit must be a positive number');
    }

    try {
        const sheetDataEntries = await SheetData.findAll({
            where: {
                user_id: parseInt(userId)
            },
            attributes: ['id', 'user_id', 'link', 'sheet_name', 'frequency', 'pre_prompt', 'post_prompt', 'next_run_at', 'created_at'],
            order: [['created_at', 'DESC']],
            limit: limit
        });
        return sheetDataEntries.map(entry => entry.dataValues);
    }
    catch (error) {
        throw new Error(`Failed to fetch sheet data entries: ${error.message}`);
    }
}

export async function findByUserId(userId, limit = 20) {
    if (!userId || isNaN(userId)) {
        throw new Error('Valid user ID is required');
    }

    if (limit && (isNaN(limit) || limit < 1)) {
        throw new Error('Limit must be a positive number');
    }

    try {
        const sheetDataEntries = await SheetData.findAll({
            where: {
                user_id: parseInt(userId)
            },
            order: [['created_at', 'DESC']],
            limit: limit
        });
        return sheetDataEntries.map(entry => entry.dataValues);
    }
    catch (error) {
        throw new Error(`Failed to fetch sheet data by user ID: ${error.message}`);
    }
}

export async function updateById(id, updateData) {
    if (!id || isNaN(id)) {
        throw new Error('Valid sheet data ID is required');
    }

    const existingSheetData = await SheetData.findByPk(parseInt(id));
    if (!existingSheetData) {
        throw new Error('Sheet data not found');
    }

    const { link, sheet_name, frequency, pre_prompt, post_prompt, next_run_at, created_at } = updateData;
    const updateFields = {};

    if (link) updateFields.link = link.trim();
    if (sheet_name) updateFields.sheet_name = sheet_name.trim();
    if (pre_prompt) updateFields.pre_prompt = pre_prompt.trim();
    if (post_prompt) updateFields.post_prompt = post_prompt.trim();
    if (created_at) updateFields.created_at = created_at;
    if (next_run_at) updateFields.next_run_at = next_run_at;

    if (frequency) {
        updateFields.frequency = frequency.trim();

        const userTimezone = await userRepository.findTimezoneById(existingSheetData.user_id);

        const nowInUserTz = DateTime.now().setZone(userTimezone);
        updateFields.created_at = nowInUserTz.toFormat('yyyy-MM-dd HH:mm:ss');

        const cronExpression = frequency ? frequency.trim() : existingSheetData.frequency;

        if (cronExpression.toLowerCase() !== 'none') {
            updateFields.next_run_at = calculateNextRunTime(cronExpression, userTimezone);
        }
    }

    if (Object.keys(updateFields).length === 0) {
        throw new Error('No valid fields to update');
    }

    try {
        const [updatedRowsCount] = await SheetData.update(updateFields, {
            where: { id: parseInt(id) },
            returning: true
        });

        if (updatedRowsCount === 0) {
            return null;
        }

        const updatedSheetData = await SheetData.findByPk(parseInt(id));
        return updatedSheetData.dataValues;
    }
    catch (error) {
        throw new Error(`Failed to update sheet data: ${error.message}`);
    }
}

export async function deleteById(id) {
    if (!id || isNaN(id)) {
        throw new Error('Valid sheet data ID is required');
    }

    try {
        const sheetData = await SheetData.findByPk(parseInt(id));
        if (!sheetData) {
            return null;
        }

        const sheetDataValues = sheetData.dataValues;
        await sheetData.destroy();
        return sheetDataValues;
    }
    catch (error) {
        throw new Error(`Failed to delete sheet data: ${error.message}`);
    }
}

export async function deleteByUserId(userId) {
    if (!userId || isNaN(userId)) {
        throw new Error('Valid user ID is required');
    }

    try {
        const deletedRowsCount = await SheetData.destroy({
            where: { user_id: parseInt(userId) }
        });
        return deletedRowsCount;
    }
    catch (error) {
        throw new Error(`Failed to delete sheet data by user ID: ${error.message}`);
    }
}

export async function findUserIdById(id) {
    if (!id || isNaN(id)) {
        throw new Error('Valid sheet data ID is required');
    }

    try {
        const sheetData = await SheetData.findByPk(parseInt(id), {
            attributes: ['user_id']
        });
        return sheetData ? sheetData.dataValues.user_id : null;
    }
    catch (error) {
        throw new Error(`Failed to find user ID: ${error.message}`);
    }
}