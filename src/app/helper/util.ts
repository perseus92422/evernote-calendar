import moment from "moment";

export const dateToYYYYMMDDF = (date: Date): string => {
    return moment(date).format('YYYY-MM-DD');
}

export const compareDate = (start: Date, end: Date): Boolean => {
    if (moment(end).isBefore(start))
        return false;
    else
        return true;
}

export const getStartDayOfMonth = (): string => {
    return moment().startOf('M').startOf('W').weekday(0).format('YYYY-MM-DD');
}

export const getEndDayOfMonth = (): string => {
    return moment().startOf('M').startOf('W').weekday(0).format('YYYY-MM-DD');
}

export const getYear = (date: Date): number => {
    return moment(date).year();
}
