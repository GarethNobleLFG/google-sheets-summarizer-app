export const validateAndParseHour = (
    inputValue: string, 
    defaultValue: number = 9,
    onUpdate: (value: number) => void
): void => {
    if (inputValue === '') {
        return;
    }
    
    const numericValue = parseInt(inputValue);
    
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 23) {
        onUpdate(numericValue);
    } 
    else {
        onUpdate(defaultValue);
    }
};