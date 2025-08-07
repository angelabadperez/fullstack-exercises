import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      return [...state, action.payload]
    },
    replaceAnecdote(state, action) {
      return state.map(anecdote => anecdote.id !== action.payload.id ? anecdote : action.payload)
    }
  }
})

export const { setAnecdotes, appendAnecdote, replaceAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const create = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const changedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }
    const updatedAnecdote = await anecdoteService.vote(changedAnecdote)
    dispatch(replaceAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer