import { createSlice } from "@reduxjs/toolkit";

const defaultCanadianFrench = {
    id: 5,
    name: "Français",
    code: "fr",
    type: "LTR",
    system_type: 3,
    is_default: 1,
    display_name: "Français (CA)",
};

const initialState = {
    selectedLanguage: defaultCanadianFrench,
    availableLanguages: [
        defaultCanadianFrench,
        {
            id: 3,
            name: "English",
            code: "en",
            type: "LTR",
            system_type: 3,
            is_default: 0,
            display_name: "English",
        }
    ]
};

export const languageReducer = createSlice({
    name: "language",
    initialState,
    reducers: {
        setSelectedLanguage: (state, action) => {
            state.selectedLanguage = action.payload.data
        },
        setAvailableLanguages: (state, action) => {
            state.availableLanguages = action.payload.data
        }
    }
})

export const { setAvailableLanguages, setSelectedLanguage } = languageReducer.actions
export default languageReducer.reducer