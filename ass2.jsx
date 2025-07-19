// 2.18, 2.19, 2.20

import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"


const CountryInfo = (props) => {
  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);
  const api = import.meta.env.VITE_API_KEY
  const [lat,setLat] = useState(null)
  const [lon,setLon] = useState(null)
  const [main,setMain] = useState(null)
  const [wind,setWind] = useState(null)
  const [weather,setWeather] = useState(null)

  useEffect(()=>{
    axios
    .get(`http://api.openweathermap.org/geo/1.0/direct?q=${props.capitals[0]}&limit=1&appid=${api}`)
    .then(response => {
      // console.log( "city",response.data)
      setLat(response.data[0].lat)
      setLon(response.data[0].lon)
  })
  },[props.capitals])

  useEffect(()=>{
    if(lat!== null && lon!==null){
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`)
      .then(response => {
        setMain(response.data.main)
        setWeather(response.data.weather)
        setWind(response.data.wind)
        // console.log("weather", response.data.main, response.data.weather)
      }).catch(error=>{
        console.log("cant catch weather,", error)
      })
    }
  },[lat,lon])

  return(
    <div>
      <h2>{props.name}</h2>
      <img src={props.image} width="150" 
        alt={props.alt}/>
      <p>{props.capitals.length > 1 ? 'Capitals' : 'Capital'} : {' '} 
      {props.capitals ? props.capitals.join(', ') : 'NA'}</p>
      <p>Area: {props.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(props.languages).map((lang,i) => (
          <li key={i}>{lang}</li>
        ))}
      </ul>
      <h2>Weather in {props.capitals[0]}</h2>
      {main && weather && wind ? (
      <div>
        <p>Temperature: {kelvinToCelsius(main.temp)} Celcius</p>
        <img 
        src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
        alt={weather[0].description}
        />
        <p>{weather[0].description}</p>
        <p>wind: {wind.speed} m/s</p>
      </div>
      ):(
      <div><p>Fetching weather...</p></div>
      )}
    </div>)
}

const Countries = ({data,display}) => {
  if(display.trim()===''){
    return <div>Search to display</div>
  }
  const [show, setShow] = useState(false)
  const [index, setIndex] = useState(null)
  // console.log(data)

  const matches = data
    .map((item,index) => ({name:item.name.common, index}))
    .filter(entry =>
      entry.name.toLowerCase().includes(display.toLowerCase())
    )
  // console.log("matches",matches)

  const handleClick = (index) => {
    // console.log("index",index)
    setShow(true)
    setIndex(index)
  }

  if(matches.length === 1){
    return(
    <CountryInfo
    name={matches[0].name}
    image={data[matches[0].index].flags.png}
    alt={data[matches[0].index].flags.alt}
    capitals={data[matches[0].index].capital}
    area={data[matches[0].index].area}
    languages={data[matches[0].index].languages}
    />)
  }
  if(matches.length > 10){
    return(<div>Too many matches, specify another filter</div>)
  }
  return(
    <div>
        {show && index !== null ? 
        (<CountryInfo
        name={data[index].name.common}
        image={data[index].flags.png}
        alt={data[index].flags.alt}
        capitals={data[index].capital}
        area={data[index].area}
        languages={data[index].languages}
        />) :
        (<ul>
          {matches.map((country) => (
            <li key={country.index}>
              {country.name}{' '}
              <button onClick={() => handleClick(country.index)}>Show</button>
            </li>))}
        </ul>)
        }
    </div>
  )
}

const App2 = () => {
  const [countries, setCountries] = useState([])
  const [value, setValue] = useState('')
  const url = 'https://studies.cs.helsinki.fi/restcountries/'

  useEffect(()=>{
    axios.get(`${url}/api/all`).then(response => {
      const countryData = response.data
      setCountries(countryData)
      // console.log("countryData",countryData)
    })
  },[])

  const handleChange = (event) => {
    console.log(event.target.value)
    setValue(event.target.value)
  }

  return (
    <div>
      find countries
      <input value={value} onChange={handleChange}/>
      <Countries data ={countries} display={value}/>
    </div>
  )
}

// 2.6 through 2.17

import { useEffect, useState } from "react"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import services from "./services/persons"
import Message from "./components/Message"

const App1 = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    services.getAll().then(response => {
      console.log('got data',response)
      setPersons(response)
    })
  },[])

  const handleSubmit = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)
    console.log('submitted new name',newName)
    if(newName==='' || newNumber===''){
      const message = `Enter all fields`
      alert(message)
    }
    else if(names.includes(newName)){
      const option = window.confirm(`${newName} already exists, do you want to change the number?`)
      if(option){
        console.log('change number')
        const person = persons.find(p => p.name === newName)
        const updatedPerson = {...person, number:newNumber}

        services.update(person.id,updatedPerson).then(response => {
          console.log("updated record", response)
          setPersons(persons.map(p => p.id === person.id ? updatedPerson : p))
        }).catch(error => {
          alert("error changing")
          console.log(error)
          setMessage(`Information of ${newName} has already been removed from server`)
          setTimeout(() => {setMessage(null)},5000)
        })
        setMessage(`changed ${newName}'s number`)
        setTimeout(() => {setMessage(null)},5000)
        setNewName('')
        setNewNumber('')
      }
      else{console.log('dont change')}
    }
    else{
      const newPerson = {
        name: newName,
        number: newNumber
      }
      services.create(newPerson).then(response => {
        console.log('adding new person',response)
        setPersons(persons.concat(response))
        setMessage(`Added new contact: ${newName}`)
        setTimeout(()=> {setMessage(null)},5000)
        setNewName('')
        setNewNumber('')
      }).catch(error => {
        console.log("error addding new person", error.response.data)
        setMessage(error.response.data.error)
        setTimeout(()=> {setMessage(null)},5000)
      })
    }
  }

  const handleChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    const option = window.confirm("Do you want to delete this entry?")
    if(option){
      console.log("delete")
      const deletePerson = persons.find(p => p.id === id).name
      console.log(deletePerson)
      services.remove(id).then(()=>{
        setPersons(persons.filter(p => p.id !== id))
      }).catch(error => {
        console.log(error)
        setMessage(`Information of ${deletePerson} has been removed from server`)
        setTimeout(()=>{setMessage(null)},5000)
      })
      setMessage(`Deleted contact ${deletePerson}`)
      setTimeout(()=>{setMessage(null)},5000)
    }
    else{console.log("dont")}
  }

  return (
    <div>
      <div>
        <h2>PhoneBook</h2>
        <Filter value={filter} handle={handleChange}/>
      </div>
      <h2>add a new contact</h2>
      <PersonForm
      submit={handleSubmit}
      name={newName}
      number={newNumber}
      setNewName={setNewName}
      setNewNumber={setNewNumber}
      />
      <Message message={message}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete}/>
    </div>
  )
}

// 2.1 through 2.5

import Course from "./components/Course"

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      {courses.map((course) => (
        <Course key={course.id} course={course}/>
      ))}
    </div>
  )
}

export default App