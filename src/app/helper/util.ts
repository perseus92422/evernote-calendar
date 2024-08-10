import moment from "moment";

export const dateToYYYYMMDDF = (date: Date): string => {
    return moment(date).format('YYYY-MM-DD');
}

export const compareDate = (start: Date, end: Date): Boolean => {
    if (moment(end).isBefore(start) || moment(end).isSame(start))
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

export const getFullDescriptionOfMonth = (date: Date, intl: number) => {
    console.log("month ", moment(date).format('YYYY-MMMM-DD'))
    console.log("intl ", intl)
    if (intl == 1) {
        moment.locale('zh-cn');
    }
    return moment(date).locale('zh-cn').format('MMMM');
}

export const getDaysOfMonth = () => {
    
}