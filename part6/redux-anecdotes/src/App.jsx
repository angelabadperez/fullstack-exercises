import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Notification from './components/Notification'
import AnecdoteFilter from './components/AnecdoteFilter'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import anecdoteService from './services/anecdotes'
import { setAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    anecdoteService.getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
  }, [])

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <AnecdoteFilter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App