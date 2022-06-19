import Person from "./Person";
export const Persons = ({display, persons}) => (
    <div>
      {(display.length === 0? persons: display)
          .map(contact => <Person key={contact.id} number={contact.number} name={contact.name} />)}
    </div>
)

