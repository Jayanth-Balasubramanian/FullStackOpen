import { useState } from 'react'

const Feedback = ({setGood, setNeutral, setBad}) => {
  return (
      <div>
        <h1>give feedback</h1>
        <button onClick={setGood}> good </button>
        <button onClick={setNeutral}> neutral </button>
        <button onClick={setBad}> bad </button>
      </div>
  )
}

const Statistics = ({good, neutral, bad}) => {
  return (
      <div>
        <h1> Statistics </h1>
        <>
          {good + bad + neutral > 0 ?
              <table>
                <tbody>
                <tr>
                  <td> good </td>
                  <td>{good}</td>
                </tr>

                <tr>
                  <td> neutral </td>
                  <td>{neutral}</td>
                </tr>

                <tr>
                  <td> bad </td>
                  <td>{bad}</td>
                </tr>

                <tr>
                  <td> all </td>
                  <td>{good + neutral + bad}</td>
                </tr>

                <tr>
                  <td> average </td>
                  <td>{((good - bad)/(good + neutral + bad)).toFixed(1)}</td>
                </tr>
                <tr>
                  <td> positive </td>
                  <td>{(good/(good + neutral + bad) * 100).toFixed(1)}%</td>
                </tr>
                </tbody>
              </table>
              : <p> No feedback given </p>
          }
        </>
      </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  return (
      <div>
        <Feedback setGood={() => setGood(good + 1)} setBad={() => setBad(bad + 1)}
                  setNeutral={() => setNeutral(neutral + 1)} />
        <Statistics good={good} bad={bad} neutral={neutral} />
      </div>
  )
}

export default App