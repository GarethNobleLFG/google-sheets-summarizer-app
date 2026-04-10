import { API_BASE_URL } from '../config/api';

// POST - Create Sheet Data
export const createSheetData = async (userId: number, link: string, sheetName: string, frequency: string, prePrompt: string, postPrompt: string, token?: string) => {
    const response = await fetch(`${API_BASE_URL}/sheet-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, link, sheetName, frequency, prePrompt, postPrompt }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// GET - Get Sheet Data By ID
export const getSheetDataById = async (id: string | number, token?: string) => {
    const response = await fetch(`${API_BASE_URL}/sheet-data/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// GET - Get All Sheet Data From User
export const getAllSheetDataFromUser = async (userId: string | number, limit?: number, token?: string) => {
    const url = limit
        ? `${API_BASE_URL}/sheet-data/user/${userId}/all?limit=${limit}`
        : `${API_BASE_URL}/sheet-data/user/${userId}/all`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// PUT - Update Sheet Data
export const updateSheetData = async (id: string | number, updateData: { userId?: number; link?: string; sheetName?: string; frequency?: string; prePrompt?: string; postPrompt?: string }, token?: string) => {
    const response = await fetch(`${API_BASE_URL}/sheet-data/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// DELETE - Delete Sheet Data
export const deleteSheetData = async (id: string | number, token?: string) => {
    const response = await fetch(`${API_BASE_URL}/sheet-data/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// DELETE - Delete All User Sheet Data
export const deleteAllUserSheetData = async (userId: string | number, token?: string) => {
    const response = await fetch(`${API_BASE_URL}/sheet-data/user/${userId}/all`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// POST - Trigger User Summaries
export const triggerUserSummaries = async (userId: string | number, token?: string) => {
    const response = await fetch(`${API_BASE_URL}/sheet-data/user/${userId}/trigger`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// POST - Quick Generate Summary
export const quickGenerateSummary = async (id: string | number, token?: string) => {
    const response = await fetch(`${API_BASE_URL}/sheet-data/quick-generate/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};