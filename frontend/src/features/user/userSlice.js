import { createSlice } from "@reduxjs/toolkit";
const initialState = {id : '1', username : 'default', password  : 'default'}
const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        userAdded(state, action) {
            state.token = action.payload.token
            state.username = action.payload.username
        }
    }
})

export const { userAdded } = userSlice.actions
export default userSlice.reducer