import * as sheetDataCrudServices from '../services/summary-services/sheetDataCrudServices.js';
import * as sheetDataServices from '../services/summary-services/sheetDataPolling.js';

// Create a new sheet data entry..
export async function createSheetData(req, res) {
    try {
        const { userId, link, sheetName, frequency } = req.body;

        const sheetData = await sheetDataCrudServices.createSheetData(userId, link, sheetName, frequency);

        res.status(201).json({
            success: true,
            data: sheetData,
            message: 'Sheet data created successfully'
        });

    }
    catch (error) {
        console.error('Error creating sheet data:', error);

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

// Get sheet data by ID
export async function getSheetDataById(req, res) {
    try {
        const { id } = req.params;

        const sheetData = await sheetDataCrudServices.getSheetDataById(id);

        res.status(200).json({
            success: true,
            data: sheetData
        });

    }
    catch (error) {
        console.error('Error fetching sheet data:', error);

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

// Get all sheet data for a specific user
export async function getAllSheetDataFromUser(req, res) {
    try {
        const { userId } = req.params;
        const { limit } = req.query;

        const sheetData = await sheetDataCrudServices.getAllSheetDataFromUser(userId, limit ? parseInt(limit) : undefined);

        res.status(200).json({
            success: true,
            data: sheetData,
            meta: {
                count: sheetData.length,
                userId: parseInt(userId),
                limit: limit ? parseInt(limit) : 50
            }
        });

    }
    catch (error) {
        console.error('Error fetching user sheet data:', error);

        if (error.message.includes('required') || error.message.includes('positive number')) {
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

// Update sheet data
export async function updateSheetData(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedSheetData = await sheetDataCrudServices.updateSheetData(id, updateData);

        res.status(200).json({
            success: true,
            data: updatedSheetData,
            message: 'Sheet data updated successfully'
        });

    }
    catch (error) {
        console.error('Error updating sheet data:', error);

        if (error.message.includes('not found')) {
            return res.status(404).json({
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

// Delete sheet data
export async function deleteSheetData(req, res) {
    try {
        const { id } = req.params;

        const deletedSheetData = await sheetDataCrudServices.deleteSheetData(id);

        res.status(200).json({
            success: true,
            data: deletedSheetData,
            message: 'Sheet data deleted successfully'
        });

    }
    catch (error) {
        console.error('Error deleting sheet data:', error);

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

// Delete all sheet data for a user
export async function deleteAllUserSheetData(req, res) {
    try {
        const { userId } = req.params;

        const deletedCount = await sheetDataCrudServices.deleteAllUserSheetData(userId);

        res.status(200).json({
            success: true,
            data: {
                deletedCount,
                userId: parseInt(userId)
            },
            message: `Deleted ${deletedCount} sheet data entries for user ${userId}`
        });

    }
    catch (error) {
        console.error('Error deleting user sheet data:', error);

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

// Poll all users for scheduled summaries
export async function pollUsersForScheduledSummaries(req, res) {
    try {

        res.status(200).json({
            success: true,
            message: 'Polling started in background'
        });

        const result = await sheetDataServices.pollUsersForScheduledSummaries();
    }
    catch (error) {
        console.error('Error polling users for scheduled summaries:', error);

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}

// Trigger user summaries (from sheetDataServices)
export async function triggerUserSummaries(req, res) {
    try {
        const { userId } = req.params;

        const result = await sheetDataServices.triggerUserSummaries(userId);

        res.status(200).json({
            success: true,
            data: result,
            message: `Triggered summaries for user ${userId}. Executed: ${result.executed}, Errors: ${result.errors.length}`
        });

    }
    catch (error) {
        console.error('Error triggering user summaries:', error);

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