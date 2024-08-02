import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "reduxjs-toolkit-persist";
// import storage from 'reduxjs-toolkit-persist/lib/storage'
import { CalenderSlice } from "./calenderSlice";

// const persistConfig = {
//     key: 'root',
//     storage,
// };

// const persistedReducer = persistReducer(persistConfig, combineReducers({
//     [CalenderSlice.name]: CalenderSlice.reducer
// }))

export const store = configureStore({
    reducer: {
        [CalenderSlice.name]: CalenderSlice.reducer
    }
});
// export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// export type AppThunk<ReturnType = void> = ThunkAction<
//     ReturnType,
//     RootState,
//     unknown,
//     Action<string>
// >;
