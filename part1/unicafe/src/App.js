import { useState } from 'react'
const Button = ({buttonText, eventHandler}) => {
  return (
      <button onClick={eventHandler}>{buttonText}</button>
  )
}
const StatisticLine = ({statName, data}) => {
  return (<tr><td> {statName} {data} </td></tr>)
}
const Feedback = ({setGood, setNeutral, setBad}) => {
  return (
      <div>
        <h1>give feedback</h1>
        <Button buttonText={"good"} eventHandler={setGood} />
        <Button buttonText={"neutral"} eventHandler={setNeutral} />
        <Button buttonText={"bad"} eventHandler={setBad} />
      </div>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + bad + neutral
  const average = ((good - bad)/total).toFixed(1)
  const positive = (good/total * 100).toFixed(1) + "%"
  return (
      <div>
        <h1> Statistics </h1>
        <>
          {good + bad + neutral > 0 ?
              <table>
                <tbody>
                  <StatisticLine statName={"good"} data={good} />
                  <StatisticLine statName={"neutral"} data={neutral} />
                  <StatisticLine statName={"bad"} data={bad} />
                  <StatisticLine statName={"all"} data={total} />
                  <StatisticLine statName={"average"} data={average} />
                  <StatisticLine statName={"positive"} data={positive} />
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