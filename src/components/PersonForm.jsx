const PersonForm = (props) => {
    return (
        <form onSubmit={props.submit}>
        <div>
          name: 
          <input 
          value={props.name}
          onChange={(event)=>props.setNewName(event.target.value)}
          />
        </div>
        <div>
          number:
          <input
          value={props.number}
          onChange={(event)=>props.setNewNumber(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm