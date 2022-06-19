import { useState } from 'react'
import {Persons} from "./components/Persons";
import {Filter} from "./components/Filter";
import {PersonForm} from "./components/PersonsForm";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [display, setDisplay] = useState([])
  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }
  const handleFilterChange = e => {
    setDisplay(persons.filter(x => x.name.toLowerCase().includes(e.target.value)))
  }
  const handleNumberChange = e => {
    setNumber(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (persons.filter(x => x.name === newName).length === 0) {
      const newPersons = [...persons, {'name': newName, 'number': number, 'id': persons.length + 1}]
      setPersons(newPersons)
      console.log(newPersons)
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
      <div>
        <h2>Phonebook</h2>
        <Filter onChange={handleFilterChange}/>
        <h2> add a new </h2>
        <PersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
                    handleSubmit={handleSubmit}/>
        <h2>Numbers</h2>
        <Persons display={display} persons={persons}/>
      </div>
  )
}

export default App