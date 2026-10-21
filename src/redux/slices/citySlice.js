import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    status: "fulfill",
    city: {
        id: 1,
        name: "Montréal",
        state: "Québec",
        formatted_address: "Montréal, QC, Canada",
        latitude: 45.5017,
        longitude: -73.5673,
    },
};
export const locationReducer = createSlice({
    name: "city",
    initialState,
    reducers: {
        setCity: (state, action) => {
            state.status = "fulfill";
            state.city = action.payload.data;
        }
    }
});

export const { setCity } = locationReducer.actions;
export default locationReducer.reducer;