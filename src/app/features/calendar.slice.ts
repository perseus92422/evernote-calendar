import { createSlice } from "@reduxjs/toolkit";
import { UserDTO } from "../type";

const initialState: {
    intl: number;
    user: UserDTO;
    accessToken: string;
} = {

    intl: 1,
    user: null,
    accessToken: ""
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
        },
        setAccessTokenProps(state, action) {
            state.accessToken = action.payload;
        }
    }
})

export const {
    setIntlProps,
    setUserProps,
    setAccessTokenProps
} = calendarSlice.actions;
export default calendarSlice.reducer;