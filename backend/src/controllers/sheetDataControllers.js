import * as sheetDataRepository from '../repositories/sheetDataRepositories.js';
import * as sheetDataServices from '../services/sheet-data-services/sheetDataPolling.js';
import * as sheetDataQuickGen from '../services/sheet-data-services/sheetDataQuickGen.js';

export async function createSheetData(req, res) {
    try {
        const { userId, link, sheetName, frequency, prePrompt, postPrompt } = req.body;

        const sheetData = await sheetDataRepository.create({
            user_id: userId,
            link,
            sheet_name: sheetName,
            frequency,
            pre_prompt: prePrompt,
            post_prompt: postPrompt
        });

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

export async function getSheetDataById(req, res) {
    try {
        const { id } = req.params;

        const sheetData = await sheetDataRepository.findById(id);

        if (!sheetData) {
            return res.status(404).json({
                success: false,
                error: 'Sheet data not found'
            });
        }

        res.status(200).json({
            success: true,
            data: sheetData
        });

    }
    catch (error) {
        console.error('Error fetching sheet data:', error);

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

export async function getAllSheetDataFromUser(req, res) {
    try {
        const { userId } = req.params;
        const { limit } = req.query;

        const sheetData = await sheetDataRepository.findAllFromUser(userId, limit ? parseInt(limit) : undefined);

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

export async function updateSheetData(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedSheetData = await sheetDataRepository.updateById(id, updateData);

        if (!updatedSheetData) {
            return res.status(404).json({
                success: false,
                error: 'Sheet data not found'
            });
        }

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

export async function deleteSheetData(req, res) {
    try {
        const { id } = req.params;

        const deletedSheetData = await sheetDataRepository.deleteById(id);

        if (!deletedSheetData) {
            return res.status(404).json({
                success: false,
                error: 'Sheet data not found'
            });
        }

        res.status(200).json({
            success: true,
            data: deletedSheetData,
            message: 'Sheet data deleted successfully'
        });

    }
    catch (error) {
        console.error('Error deleting sheet data:', error);

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

export async function deleteAllUserSheetData(req, res) {
    try {
        const { userId } = req.params;

        const deletedCount = await sheetDataRepository.deleteByUserId(userId);

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

export async function quickGenerateSummary(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Sheet ID is required'
            });
        }

        const result = await sheetDataQuickGen.quickGenerateSummary(id);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error
            });
        }

        res.status(200).json({
            success: true,
            data: result,
            message: `Summary generated successfully for sheet ID: ${id}`
        });

    }
    catch (error) {
        console.error('Error in quick generate summary controller:', error);

        if (error.message.includes('required') || error.message.includes('Invalid') || error.message.includes('not found')) {
            const statusCode = error.message.includes('not found') ? 404 : 400;
            return res.status(statusCode).json({
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