import { createSlice } from "@reduxjs/toolkit";
const defaultCanadianSettings = {
    currency: "$",
    currency_code: "CAD",
    decimal_point: "2",
    guest_checkout: "1",
    guest_cart: "1",
};

const initialState = {
    status: 'loading',
    setting: defaultCanadianSettings,
    payment_setting: null,
    settingsFetchedTime: new Date(),
    paymentSettingsFetchTime: new Date(),
    isPopupSeen: false
};
export const settingReducer = createSlice({
    name: "setting",
    initialState,
    reducers: {
        setSetting: (state, action) => {
            state.status = "fulfill";
            const data = action.payload?.data ? { ...action.payload.data } : {};
            // Enforce Canadian Dollar currency across the platform
            data.currency = "$";
            data.currency_code = "CAD";
            state.setting = data;
            state.settingsFetchedTime = new Date();
        },
        setPaymentSetting: (state, action) => {
            state.status = "fulfill";
            state.payment_setting = action.payload.data;
            state.paymentSettingsFetchTime = new Date();
        },
        setIsPopupSeen: (state, action) => {
            state.isPopupSeen = action.payload.data;
        }
    }
});
export const { setSetting, setPaymentSetting, setIsPopupSeen } = settingReducer.actions;
export default settingReducer.reducer;