import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { RootState } from './store';
const initialState: {
    date: string,
    kind: string,
    isShowDialog: boolean,
    intl: number
} =
{
    date: moment(new Date()).format("YYYY-MM-DD"),
    kind: "month_1",
    isShowDialog: false,
    intl: 1
};
export const CalenderSlice = createSlice({
    name: "Calender",
    initialState,
    reducers: {
        setDate(state, action) {
            state.date = action.payload
        },
        setKind(state, action) {
            state.kind = action.payload
        },
        setIsShowDialog(state, action) {
            state.isShowDialog = action.payload
        },
    }
});

export const {
    setDate,
    setKind,
} = CalenderSlice.actions;
export const getCalender = (state: RootState) => state.Calender;

export default CalenderSlice.reducer;