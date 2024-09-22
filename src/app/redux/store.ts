import { configureStore } from "@reduxjs/toolkit";
import { calendarSlice } from "../features/calendar.slice";

export const store = configureStore({
    reducer: {
        [calendarSlice.name]: calendarSlice.reducer
    }
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
