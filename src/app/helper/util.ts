import moment from "moment";

export const dateToYYYYMMDDF = (date: Date) => {
    return moment(date).format('YYYY-MM-DD');
}

export const compareDate = (start: Date, end: Date) => {
    if (moment(end).isBefore(start) || moment(end).isSame(start))
        return false;
    else
        return true;
}