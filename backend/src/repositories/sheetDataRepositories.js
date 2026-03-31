import SheetData from '../models/sheetDataModel.js';
import { Op } from 'sequelize';

export async function create(sheetDataInput) {
    const { user_id, link, sheet_name, frequency, pre_prompt, post_prompt, cron_schedule, next_run_at } = sheetDataInput;

    if (!user_id || !link || !sheet_name || !frequency || !pre_prompt || !post_prompt || !cron_schedule) {
        throw new Error('User ID, link, sheet name, frequency, pre-prompt, post-prompt, and cron schedule are required');
    }

    if (isNaN(user_id)) {
        throw new Error('Valid user ID is required');
    }

    try {
        const createData = {
            user_id: parseInt(user_id),
            link: link.trim(),
            sheet_name: sheet_name.trim(),
            frequency: frequency.trim(),
            pre_prompt: pre_prompt.trim(),
            post_prompt: post_prompt.trim(),
            cron_schedule: cron_schedule.trim()
        };

        // Add next_run_at if provided, otherwise let the database handle it
        if (next_run_at) {
            createData.next_run_at = new Date(next_run_at);
        }

        const sheetData = await SheetData.create(createData);
        return sheetData.dataValues;
    }
    catch (error) {
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
            attributes: ['id', 'user_id', 'link', 'sheet_name', 'frequency', 'pre_prompt', 'post_prompt', 'cron_schedule', 'next_run_at', 'created_at'],
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

    const { link, sheet_name, frequency, pre_prompt, post_prompt, cron_schedule, next_run_at, created_at } = updateData;
    const updateFields = {};

    if (link) updateFields.link = link.trim();
    if (sheet_name) updateFields.sheet_name = sheet_name.trim();
    if (frequency) updateFields.frequency = frequency.trim();
    if (pre_prompt) updateFields.pre_prompt = pre_prompt.trim();
    if (post_prompt) updateFields.post_prompt = post_prompt.trim();
    if (cron_schedule) updateFields.cron_schedule = cron_schedule.trim();
    if (next_run_at) updateFields.next_run_at = next_run_at;
    if (created_at) updateFields.created_at = created_at;

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