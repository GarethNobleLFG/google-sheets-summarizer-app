// Check if summary should be executed based on frequency
export function checkIfShouldExecute(frequency, createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const timeDiff = now - created;

    // Convert frequency string to execution logic
    const freq = frequency.toLowerCase().trim();

    // Daily frequencies
    if (freq === 'daily') {
        // Execute if it's been at least 23 hours (to handle timing variations)
        return timeDiff >= (23 * 60 * 60 * 1000);
    }

    // Weekly frequencies
    if (freq === 'weekly') {
        // Execute if it's been at least 6.5 days
        return timeDiff >= (6.5 * 24 * 60 * 60 * 1000);
    }

    // Monthly frequencies
    if (freq === 'monthly') {
        // Execute if it's been at least 28 days
        return timeDiff >= (28 * 24 * 60 * 60 * 1000);
    }

    // Default: don't execute if we can't parse the frequency
    console.warn(`Unknown frequency format: ${frequency}`);
    return false;
}