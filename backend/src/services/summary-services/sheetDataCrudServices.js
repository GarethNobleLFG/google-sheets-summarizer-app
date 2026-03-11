import * as sheetDataRepository from '../../repositories/sheetDataRepositories.js';

// Create a new sheet data entry
export async function createSheetData(userId, link, sheetName, frequency) {
    try {
        // Validation
        if (!userId || !link || !sheetName || !frequency) {
            throw new Error('User ID, link, sheet name, and frequency are required');
        }

        if (isNaN(userId)) {
            throw new Error('Valid user ID is required');
        }

        // Create sheet data entry
        const sheetData = await sheetDataRepository.create({
            user_id: parseInt(userId),
            link: link.trim(),
            sheet_name: sheetName.trim(),
            frequency: frequency.trim()
        });

        return sheetData;

    } 
    catch (error) {
        throw error;
    }
}

// Get sheet data by ID
export async function getSheetDataById(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('Valid sheet data ID is required');
        }

        const sheetData = await sheetDataRepository.findById(parseInt(id));
        
        if (!sheetData) {
            throw new Error('Sheet data not found');
        }

        return sheetData;

    } 
    catch (error) {
        throw error;
    }
}

// Get all sheet data entries for a specific user
export async function getAllSheetDataFromUser(userId, limit = 50) {
    try {
        if (!userId || isNaN(userId)) {
            throw new Error('Valid user ID is required');
        }

        if (limit && (isNaN(limit) || limit < 1)) {
            throw new Error('Limit must be a positive number');
        }

        const sheetDataEntries = await sheetDataRepository.findAllFromUser(parseInt(userId), limit);

        return sheetDataEntries;

    } 
    catch (error) {
        throw error;
    }
}

// Get sheet data by user ID
export async function getSheetDataByUserId(userId, limit = 20) {
    try {
        if (!userId || isNaN(userId)) {
            throw new Error('Valid user ID is required');
        }

        if (limit && (isNaN(limit) || limit < 1)) {
            throw new Error('Limit must be a positive number');
        }

        const sheetDataEntries = await sheetDataRepository.findByUserId(parseInt(userId), limit);

        return sheetDataEntries;

    } 
    catch (error) {
        throw error;
    }
}

// Get sheet data by frequency
export async function getSheetDataByFrequency(frequency, limit = 20) {
    try {
        if (!frequency) {
            throw new Error('Frequency is required');
        }

        if (limit && (isNaN(limit) || limit < 1)) {
            throw new Error('Limit must be a positive number');
        }

        const sheetDataEntries = await sheetDataRepository.findByFrequency(frequency, limit);

        return sheetDataEntries;

    } 
    catch (error) {
        throw error;
    }
}

// Update sheet data
export async function updateSheetData(id, updateData) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('Valid sheet data ID is required');
        }

        const { link, sheet_name, frequency } = updateData;

        // Check if sheet data exists
        const existingSheetData = await sheetDataRepository.findById(parseInt(id));
        if (!existingSheetData) {
            throw new Error('Sheet data not found');
        }

        const updateFields = {};

        // Update link if provided
        if (link) {
            updateFields.link = link.trim();
        }

        // Update sheet name if provided
        if (sheet_name) {
            updateFields.sheet_name = sheet_name.trim();
        }

        // Update frequency if provided
        if (frequency) {
            updateFields.frequency = frequency.trim();
        }

        if (Object.keys(updateFields).length === 0) {
            throw new Error('No valid fields to update');
        }

        const updatedSheetData = await sheetDataRepository.updateById(parseInt(id), updateFields);
        return updatedSheetData;

    } 
    catch (error) {
        throw error;
    }
}

// Delete sheet data
export async function deleteSheetData(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('Valid sheet data ID is required');
        }

        const deletedSheetData = await sheetDataRepository.deleteById(parseInt(id));
        
        if (!deletedSheetData) {
            throw new Error('Sheet data not found');
        }

        return deletedSheetData;

    } 
    catch (error) {
        throw error;
    }
}

// Delete all sheet data for a user
export async function deleteAllUserSheetData(userId) {
    try {
        if (!userId || isNaN(userId)) {
            throw new Error('Valid user ID is required');
        }

        const deletedCount = await sheetDataRepository.deleteByUserId(parseInt(userId));
        
        return deletedCount;

    } 
    catch (error) {
        throw error;
    }
}