import { createSlice } from "@reduxjs/toolkit";
import { ScheduleDTO } from "../type";
import { CALENDAR_VIEW_MODE } from "../const";

const initialState: {
    schedule: ScheduleDTO[],
    intl: number;
    viewMode: CALENDAR_VIEW_MODE;
    activeDate: string;
} = {
    schedule: [],
    intl: 0,
    viewMode: CALENDAR_VIEW_MODE.month1,
    activeDate: ""
}

export const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        setScheduleProps(state, action) {
            state.schedule = action.payload;
        },
        setIntlProps(state, action) {
            state.intl = action.payload;
        },
        setViewModeProps(state, action) {
            state.viewMode = action.payload;
        },
        setActiveDateProps(state, action) {
            state.activeDate = action.payload;
        }
    }
})

export const {
    setScheduleProps,
    setIntlProps,
    setViewModeProps,
    setActiveDateProps
} = calendarSlice.actions;
export default calendarSlice.reducer;