const Course = ({ course }) => {
    const total = course.parts.reduce((sum, part) => {
        console.log(sum,part)
        return sum+part.exercises
    },0)
  
    return (
      <div>
        <h2>{course.name}</h2>
        <ul>
          {course.parts.map((part) => (
            <li key={part.id}>
              <p>{part.name} {part.exercises}</p>
            </li>
          ))}
        </ul>
        <p><strong>Total of {total} exercises</strong></p>
      </div>
    )
  }
  
  export default Course