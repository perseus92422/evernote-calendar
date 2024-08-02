import moment from "moment";

export const dateToYYYYMMDDF = (date: Date) => {
    return moment(date).format('YYYY-MM-DD');
}