import express from 'express';
import * as sheetDataController from '../controllers/sheetDataControllers.js';
// import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (authentication required)
router.post('/', /* authenticateToken, */ sheetDataController.createSheetData);
router.get('/:id', /* authenticateToken, */ sheetDataController.getSheetDataById);
router.get('/user/:userId/all', /* authenticateToken, */ sheetDataController.getAllSheetDataFromUser);
router.put('/:id', /* authenticateToken, */ sheetDataController.updateSheetData);
router.delete('/:id', /* authenticateToken, */ sheetDataController.deleteSheetData);
router.delete('/user/:userId/all', /* authenticateToken, */ sheetDataController.deleteAllUserSheetData);
router.post('/user/:userId/trigger', /* authenticateToken, */ sheetDataController.triggerUserSummaries);
router.post('/poll/scheduled-summaries', /* authenticateToken, */ sheetDataController.pollUsersForScheduledSummaries);

export default router;