export const getNaiveDate = (dateString: string): Date => {
    const date = new Date(dateString);
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
    );
};
