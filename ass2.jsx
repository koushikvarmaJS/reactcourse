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
      }).catch(error => {
        console.log(error)
      })
      setMessage(`Added new contact: ${newName}`)
      setTimeout(()=> {setMessage(null)},5000)
      setNewName('')
      setNewNumber('')
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