import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"


const CountryInfo = (props) => {
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
    </div>)
}

const Countries = ({data,display}) => {
  if(display.trim()===''){
    return <div>Search to display</div>
  }
  const [show, setShow] = useState(false)
  const [index, setIndex] = useState(null)
  console.log(data)

  const matches = data
    .map((item,index) => ({name:item.name.common, index}))
    .filter(entry =>
      entry.name.toLowerCase().includes(display.toLowerCase())
    )
  console.log("matches",matches)

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
        (matches.map((country) => (
          <ul>
            <li key={country.index}>
              {country.name}{' '}
              <button onClick={() => handleClick(country.index)}>Show</button>
            </li>
          </ul>)
        ))}
    </div>
  )
}

const App = () => {
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

export default App

// import { useState,useEffect } from "react"
// import Note from "./components/Note"
// import  services  from "./services/notes"
// import Message from "./components/Message"

// const App = (props) => {
//   const [notes, setNotes] = useState([])
//   const [newNote,setNewNote] = useState('a new note..')
//   const [showAll, setShowAll] = useState(true)
//   const [errorMessage,setErrorMessage] = useState(null)

//   const notesToShow = showAll ? notes : notes.filter(note => note.important === true)
//   const toggle = (id) => {
//     console.log(`importance of ${id} needs to be toggled`)
//     const note = notes.find(n => n.id===id)
//     const changedNote = {...note,important:!note.important}

//     services.update(id,changedNote).then(returnedNote => {
//       console.log('put toggle response', returnedNote)
//       setNotes(notes.map(note => note.id===id ? returnedNote:note))
//     })
//   }

//   const hook = () => {
//     console.log('effect')
//     services.getAll()
//       .then(initialValues => {
//         console.log('promise fulfilled in hook')
//         setNotes(initialValues)
//       })
//   }
  
//   useEffect(hook, [])
//   console.log('render',notes.length, 'notes')

//   const addNote = (event) => {
//     event.preventDefault()
//     console.log('button clicked addNote', event.target)
//     const noteObject = {
//       id: String(notes.length + 1),
//       content : newNote,
//       important : Math.random() < 0.5
//     }

//     services.create(noteObject).then(returnedNote => {
//       console.log('post new note',returnedNote)
//       setNotes(notes.concat(returnedNote))
//       setNewNote('')
//     })
//   }

//   const handleNoteChange = (event) => {
//     console.log('handlenotechange',event.target.value)
//     setNewNote(event.target.value)
//   }

//   return (
//     <div>
//       <h1>Notes</h1>
//       <Message message={errorMessage}/>
//       <div>
//         <button onClick={() => setShowAll(!showAll)}>
//           showing {showAll ? 'all' : 'important'}
//         </button>
//       </div>
//       <ul>
//         {notesToShow.map(note => 
//           <Note key={note.id} note={note} toggle={()=>toggle(note.id)}/>
//         )}
//       </ul>

//       <form onSubmit={addNote}>
//         <input 
//         value={newNote}
//         onChange={handleNoteChange}
//         />
//         <button type="submit">save</button>
//       </form>   
//     </div>
//   )
// }

// export default App