import { useState,useEffect } from "react"
import Note from "./components/Note"
import  services  from "./services/notes"
import Message from "./components/Message"

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote,setNewNote] = useState('a new note..')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage,setErrorMessage] = useState(null)

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)
  const toggle = (id) => {
    console.log(`importance of ${id} needs to be toggled`)
    const note = notes.find(n => n.id===id)
    const changedNote = {...note,important:!note.important}

    services.update(id,changedNote).then(returnedNote => {
      console.log('put toggle response', returnedNote)
      setNotes(notes.map(note => note.id===id ? returnedNote:note))
    })
  }

  const hook = () => {
    console.log('effect')
    services.getAll()
      .then(initialValues => {
        console.log('promise fulfilled in hook')
        setNotes(initialValues)
      })
  }
  
  useEffect(hook, [])
  console.log('render',notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked addNote', event.target)
    const noteObject = {
      id: String(notes.length + 1),
      content : newNote,
      important : Math.random() < 0.5
    }

    services.create(noteObject).then(returnedNote => {
      console.log('post new note',returnedNote)
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const handleNoteChange = (event) => {
    console.log('handlenotechange',event.target.value)
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Message message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          showing {showAll ? 'all' : 'important'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggle={()=>toggle(note.id)}/>
        )}
      </ul>

      <form onSubmit={addNote}>
        <input 
        value={newNote}
        onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}

export default App