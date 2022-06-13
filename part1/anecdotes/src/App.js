import { useState } from 'react'

const DisplayAnecdote = ({text, votes}) => {
  return (
      <p> {text} <br /> has {votes} {votes === 1? "vote": "votes"}</p>
  )
}

const DisplayMostVoted = ({anecdotes, votes}) => {
  const maxVotes = Math.max(...votes)
  if (maxVotes === 0) {
    return (
        <p> No votes yet </p>
    )
  } else {
    const text = anecdotes[votes.indexOf(maxVotes)]
    return (
        <DisplayAnecdote text={text} votes={maxVotes} />
    )
  }
}

const Buttons = ({increment, selectRandom}) => {
  return (
  <div>
    <button onClick={increment}>vote</button>
    <button onClick={selectRandom}>next anecdote</button>
  </div>
  )

}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))

  const selectRandomAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  }
  const incrementVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  return (
      <div>
        <h1> Anecdote of the day </h1>
        <DisplayAnecdote text={anecdotes[selected]} votes={votes[selected]} />
        <Buttons increment={incrementVote} selectRandom={selectRandomAnecdote} />
        <h1> Anecdote with most votes </h1>
        <DisplayMostVoted anecdotes={anecdotes} votes={votes} />
      </div>
  )
}

export default App