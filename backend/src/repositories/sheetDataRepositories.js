import SheetData from '../models/sheetDataModel.js';
import { Op } from 'sequelize';

// Create a new sheet data entry
export async function create(sheetDataInput) {
    const { user_id, link, sheet_name, frequency } = sheetDataInput;
    
    try {
        const sheetData = await SheetData.create({
            user_id,
            link,
            sheet_name,
            frequency
        });
        return sheetData.dataValues;
    } 
    catch (error) {
        throw new Error(`Failed to create sheet data: ${error.message}`);
    }
}

// Find by ID
export async function findById(id) {
    try {
        const sheetData = await SheetData.findByPk(id);
        return sheetData ? sheetData.dataValues : null;
    } 
    catch (error) {
        throw new Error(`Failed to find sheet data: ${error.message}`);
    }
}

// Find all sheet data entries
export async function findAll(limit = 50) {
    try {
        const sheetDataEntries = await SheetData.findAll({
            order: [['created_at', 'DESC']],
            limit: limit
        });
        return sheetDataEntries.map(entry => entry.dataValues);
    } 
    catch (error) {
        throw new Error(`Failed to fetch sheet data entries: ${error.message}`);
    }
}

// Find by user ID
export async function findByUserId(userId, limit = 20) {
    try {
        const sheetDataEntries = await SheetData.findAll({
            where: {
                user_id: userId
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

// Update sheet data by ID
export async function updateById(id, updateData) {
    try {
        const [updatedRowsCount] = await SheetData.update(updateData, {
            where: { id },
            returning: true
        });
        
        if (updatedRowsCount === 0) {
            return null;
        }
        
        const updatedSheetData = await SheetData.findByPk(id);
        return updatedSheetData.dataValues;
    } 
    catch (error) {
        throw new Error(`Failed to update sheet data: ${error.message}`);
    }
}

// Delete sheet data by ID
export async function deleteById(id) {
    try {
        const sheetData = await SheetData.findByPk(id);
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

// Delete all sheet data by user ID
export async function deleteByUserId(userId) {
    try {
        const deletedRowsCount = await SheetData.destroy({
            where: { user_id: userId }
        });
        return deletedRowsCount;
    } 
    catch (error) {
        throw new Error(`Failed to delete sheet data by user ID: ${error.message}`);
    }
}