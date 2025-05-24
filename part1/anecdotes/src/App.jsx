import { useState } from 'react'

const Anecdote = ({ text, votes }) => {
  return (
    <div>
      <p>{text}</p>
      <p>has {votes} votes</p>
    </div>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const MostVotedAnecdote = ({ anecdotes, votes }) => {
  if (Object.keys(votes).length === 0) {
    return <p>No votes yet</p>
  }

  const mostVotedIndex = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b)
  return (
    <div>
      <p>{anecdotes[mostVotedIndex]}</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({})

  const handleVoteClick = () => {
    setVotes({
      ...votes,
      [selected]: (votes[selected] || 0) + 1
    })
  }

  const handleNextAnecdoteClick = () => {
    const index = Math.floor(Math.random() * anecdotes.length)
    setSelected(index)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote text={anecdotes[selected]} votes={votes[selected] || 0} />
      <Button onClick={handleVoteClick} text="vote" />
      <Button onClick={handleNextAnecdoteClick} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <MostVotedAnecdote anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App