import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import { vote } from '../reducers/anecdoteReducer'
import { createNotification, removeNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
}

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(({ filter, anecdotes }) => {
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
    if (!filter) {
      return sortedAnecdotes
    }
    const filteredAnecdotes = sortedAnecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    return filteredAnecdotes
  })

  const voteAnecdote = (anecdote) => {
    dispatch(vote(anecdote.id))
    dispatch(createNotification(`you voted '${anecdote.content}'`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return (
    <div>
      {anecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => voteAnecdote(anecdote)}
        />
      ))}
    </div>
  )
}

export default AnecdoteList