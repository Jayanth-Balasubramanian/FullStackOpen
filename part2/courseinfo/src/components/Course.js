const Header = ({text}) => (
    <h3> {text} </h3>
)

const Part = ({part}) =>
    <p>
      {part.name} {part.exercises}
    </p>

const Content = ({parts}) => (
    <>
      {parts.map(part => <Part part={part} />)}
    </>
)

const Total = ({parts}) => (
    <p> <b> Total of {parts.reduce((total, part) => total + part.exercises, 0)} exercises </b> </p>
)

const Course = ({course}) => (
    <>
      <Header text={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
)

export default Course