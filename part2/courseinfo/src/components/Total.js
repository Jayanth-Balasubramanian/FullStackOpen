export const Total = ({parts}) => (
    <p> <b> Total of {parts.reduce((total, part) => total + part.exercises, 0)} exercises </b> </p>
)