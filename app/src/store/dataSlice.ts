import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    apiData: null,
  },
  reducers: {
    setApiData: (state, action) => {
      state.apiData = action.payload;
    },
  },
});

export const { setApiData } = dataSlice.actions;
export default dataSlice.reducer;
