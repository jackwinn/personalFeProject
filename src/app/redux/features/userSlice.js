import { createSlice } from '@reduxjs/toolkit'
import { boolean } from 'yup';

// export interface AgentState {
//   _id: string | null
//   userName: string
//   name: string
//   email: string
//   image: string
//   views: string
//   expiryDate: Date | null
//   state: string
//   area: string
//   loc: any | null
// }



const initialState = {
  _id: null,
  role: '',
  access:{
    modules: []
  }
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

export const { updateUserSlice, logOut } = userSlice.actions

export default userSlice.reducer