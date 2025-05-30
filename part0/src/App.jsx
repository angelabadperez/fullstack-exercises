const Header = ({course}) => <h1>{course}</h1>

const Content = ({parts}) => <div>{parts.map(part => <Part key={part.id} part={part}/>)}</div>

const Part = ({part}) => <p>{part.name} {part.exercises}</p>

const Total = ({total}) => <p><b>total of {total} exercises</b></p>

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        id: 1,
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        id: 2,
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        id: 3,
        name: 'State of a component',
        exercises: 14,
      },
      {
        id: 4,
        name: 'Redux',
        exercises: 11,
      },
    ],
  }

  return (
    <Course course={course} />
  )
}

export default App