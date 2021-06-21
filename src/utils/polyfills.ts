Date.prototype.getWeekNumber = function() {
    const d = new Date(+this);
    d.setHours(0,0,0);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    return Math.ceil((((d.getTime()-new Date(d.getUTCFullYear(),0,1).getTime())/8.64e7)+1)/7);
};

declare global {
    interface Date {
        getWeekNumber: () => number;
    }
}

export { };