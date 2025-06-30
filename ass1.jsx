// Unicafe

import { useState } from 'react'


const StatisticLine = (props) => {
  const {text,value} = props
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const {good, neutral, bad, all, average, positive} = props
  if(all){
    return(
      <table>
        <tbody>
          <StatisticLine text='good' value={good}/>
          <StatisticLine text='neutral' value={neutral}/>
          <StatisticLine text='bad' value={bad}/>
          <StatisticLine text='all' value={all}/>
          <StatisticLine text='average' value={average}/>
          <StatisticLine text='positive' value={positive}/>
        </tbody>
      </table>
    )
  }
  else{
    return(
      <div>No Feedback Given</div>
    )
  }
}

const App1 = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [positive, setPositive] = useState(0)
  const [average, setAverage] = useState(0)
  const [all, setAll] = useState(0)

  const handleClick = (text) => {
    let newGood = good
    let newNeutral = neutral
    let newBad = bad
    let newAll = all
    if(text == 'good'){
      newGood+=1
      setGood(newGood)
    }
    else if(text=='neutral'){
      newNeutral+=1
      setNeutral(newNeutral)
    }
    else if(text=='bad'){
      newBad+=1
      setBad(newBad)
    }
    newAll = newGood + newBad + newNeutral
    setAll(newAll)
    setAverage((newGood-newBad)/newAll)
    setPositive(newGood/newAll)
    console.log(newGood,newNeutral,newBad)
  }

  return (
    <div>
      <p>Give feedback</p>
      <button onClick={()=>handleClick('good')}>good</button>
      <button onClick={()=>handleClick('neutral')}>neutral</button>
      <button onClick={()=>handleClick('bad')}>bad</button>
      <p> </p>
      <p>Statistics</p>
      <Statistics 
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        positive={positive}
        average={average}
      />
    </div>
  )
}

//Anecdote

import { useState } from 'react'

const Most = (props) => {
  const {value,text} = props
  if(value){
    return(
      <div>
        <p>Anecdotes with most votes</p>
        <p>{text}</p>
        <p>This anecdote has {value} votes</p>
      </div>
    )
  }
  else{
    return(
      <p>You can vote the anecdotes</p>
    )
  }
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
  const [votes,setVotes] = useState(Array(anecdotes.length).fill(0))
  const [most,setMost] = useState(0)

  const handleClick = () => {
    const number = Math.floor(Math.random()*8)
    setSelected(number)
    console.log(number)
  }

  const voteClick = () => {
    const copy = [...votes]
    copy[selected]+=1
    setVotes(copy)
    if(copy[selected]>=votes[most]){
      setMost(selected)
    }
  }

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>This anecdote has {votes[selected]} votes</p>
      <button onClick={voteClick}>vote</button>
      <button onClick={handleClick}>next anecdote</button>
      <Most value={votes[most]} text={anecdotes[most]}/>
    </div>
  )
}

export default App