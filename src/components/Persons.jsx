const Persons = (props) =>{
    return (
        <div>
            <ul>
            {props.persons
            .filter(person => person.name.toLowerCase().includes(props.filter.toLowerCase()))
            .map((person) => (
            <li key={person.id}>
                {person.name} {person.number}
                <button onClick={() => props.handleDelete(person.id)}>delete</button>
            </li>
            ))}
        </ul>
      </div>
    )
}

export default Persons