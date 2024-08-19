import { createSlice } from "@reduxjs/toolkit";
import { UserDTO } from "../type";

const initialState: {
    intl: number;
    user: UserDTO;
} = {

    intl: 1,
    user: null
}

export const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        setIntlProps(state, action) {
            state.intl = action.payload;
        },
        setUserProps(state, action) {
            state.user = action.payload;
        }
    }
})

export const {
    setIntlProps,
    setUserProps
} = calendarSlice.actions;
export default calendarSlice.reducer;