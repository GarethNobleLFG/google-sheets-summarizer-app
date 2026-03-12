// Create Sheet Data
export const createSheetData = async (userId: number, link: string, sheetName: string, frequency: string) => {
    const response = await fetch('http://localhost:3000/sheet-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, link, sheetName, frequency }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Get Sheet Data By ID
export const getSheetDataById = async (id: string | number) => {
    const response = await fetch(`http://localhost:3000/sheet-data/${id}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Get All Sheet Data From User
export const getAllSheetDataFromUser = async (userId: string | number, limit?: number) => {
    const url = limit
        ? `http://localhost:3000/sheet-data/user/${userId}/all?limit=${limit}`
        : `http://localhost:3000/sheet-data/user/${userId}/all`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Update Sheet Data
export const updateSheetData = async (id: string | number, updateData: { userId?: number; link?: string; sheetName?: string; frequency?: string }) => {
    const response = await fetch(`http://localhost:3000/sheet-data/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Delete Sheet Data
export const deleteSheetData = async (id: string | number) => {
    const response = await fetch(`http://localhost:3000/sheet-data/${id}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Delete All User Sheet Data
export const deleteAllUserSheetData = async (userId: string | number) => {
    const response = await fetch(`http://localhost:3000/sheet-data/user/${userId}/all`, {
        method: 'DELETE',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};

// Trigger User Summaries
export const triggerUserSummaries = async (userId: string | number) => {
    const response = await fetch(`http://localhost:3000/sheet-data/user/${userId}/trigger`, {
        method: 'POST',
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
};