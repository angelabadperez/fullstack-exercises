import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    }
  }
})

export const { createNotification, clearNotification } = notificationSlice.actions

export const setNotification = (notification, secondsToClear) => {
  return dispatch => {
    dispatch(createNotification(notification))
    setTimeout(() => {
      dispatch(clearNotification())
    }, secondsToClear * 1000)
  }
}

export default notificationSlice.reducer