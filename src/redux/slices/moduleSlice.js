import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modules: [{ id: 1, slug: "grocery", name: "Épicerie" }],
    activeModuleId: 1,
};

export const moduleReducer = createSlice({
    name: "module",
    initialState,
    reducers: {
        setModules: (state, action) => {
            state.modules = action.payload.data;
        },
        setActiveModule: (state, action) => {
            state.activeModuleId = action.payload.data;
        },
    },
});

export const { setModules, setActiveModule } = moduleReducer.actions;
export default moduleReducer.reducer;