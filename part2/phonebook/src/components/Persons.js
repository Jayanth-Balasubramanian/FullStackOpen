import Person from "./Person";
export const Persons = ({filter, display, persons, handleDelete}) => (
    <div>
      {(display.length === 0 || filter.length === 0? persons: display)
          .map(person => <Person key={person.id} person={person} handleDelete={() => handleDelete(person.id)}/>)}
    </div>
)

