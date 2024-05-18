import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id: null,
  role: '',
  access:{
    modules: []
  },
  token: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserSlice: (state, action) => {
      return {
        ...action.payload,
        
      }
    }
    //to add logout reducer here
  },
})

export const { updateUserSlice } = userSlice.actions

export default userSlice.reducer