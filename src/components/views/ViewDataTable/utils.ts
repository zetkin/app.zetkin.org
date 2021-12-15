export function colIdFromFieldName(colFieldName : string) : number {
    // colFieldName is a string like col_10, where 10 is the
    // ID of the view column that this refers to.
    const nameFields = colFieldName.split('_');
    return parseInt(nameFields[1]);
}
