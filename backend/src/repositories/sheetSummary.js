import SheetSummaryModel from '../models/sheetSummaryModel.js';
import { Op } from 'sequelize';

// Create a new summary
export async function create(summaryData) {
    const { summary_type, text_version, html_version } = summaryData;
    
    try {
        const summary = await SheetSummaryModel.create({
            summary_type,
            text_version,
            html_version
        });
        return summary.dataValues;
    } 
    catch (error) {
        throw new Error(`Failed to create summary: ${error.message}`);
    }
}

// Find by ID
export async function findById(id) {
    try {
        const summary = await SheetSummaryModel.findByPk(id);
        return summary ? summary.dataValues : null;
    } 
    catch (error) {
        throw new Error(`Failed to find summary: ${error.message}`);
    }
}

// Find all summaries
export async function findAll(limit = 50) {
    try {
        const summaries = await SheetSummaryModel.findAll({
            order: [['created_at', 'DESC']],
            limit: limit
        });
        return summaries.map(summary => summary.dataValues);
    } 
    catch (error) {
        throw new Error(`Failed to fetch summaries: ${error.message}`);
    }
}

// Find by type
export async function findByType(summaryType, limit = 20) {
    try {
        const summaries = await SheetSummaryModel.findAll({
            where: {
                summary_type: summaryType
            },
            order: [['created_at', 'DESC']],
            limit: limit
        });
        return summaries.map(summary => summary.dataValues);
    } 
    catch (error) {
        throw new Error(`Failed to fetch summaries by type: ${error.message}`);
    }
}

// Delete a summary
export async function deleteById(id) {
    try {
        const summary = await SheetSummaryModel.findByPk(id);
        if (!summary) {
            return null;
        }
        
        const summaryData = summary.dataValues;
        await summary.destroy();
        return summaryData;
    } 
    catch (error) {
        throw new Error(`Failed to delete summary: ${error.message}`);
    }
}

// Update a summary
export async function updateById(id, updateData) {
    try {
        const [updatedRowsCount] = await SheetSummaryModel.update(updateData, {
            where: { id },
            returning: true
        });
        
        if (updatedRowsCount === 0) {
            return null;
        }
        
        const updatedSummary = await SheetSummaryModel.findByPk(id);
        return updatedSummary.dataValues;
    } 
    catch (error) {
        throw new Error(`Failed to update summary: ${error.message}`);
    }
}

// Count summaries by type
export async function countByType(summaryType) {
    try {
        const count = await SheetSummaryModel.count({
            where: {
                summary_type: summaryType
            }
        });
        return count;
    } 
    catch (error) {
        throw new Error(`Failed to count summaries: ${error.message}`);
    }
}