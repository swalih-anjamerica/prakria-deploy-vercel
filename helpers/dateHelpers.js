export const dateFormatter = (dateObj, string = false) => {

    if (string) return (dateObj.getUTCFullYear()) + "/" + (dateObj.getMonth() + 1) + "/" + (dateObj.getUTCDate());

    return new Date(dateObj.getUTCFullYear()) + "/" + (dateObj.getMonth() + 1) + "/" + (dateObj.getUTCDate());

}