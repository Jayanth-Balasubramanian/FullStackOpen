import {useEffect, useState} from 'react'
import {Persons} from "./components/Persons";
import {Filter} from "./components/Filter";
import {PersonForm} from "./components/PersonsForm";
import axios from "axios";
const App = () => {
  const [persons, setPersons] = useState([ ])
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
  const fetchData = () => {
    axios.get("http://localhost:3001/persons").then(response => setPersons(response.data))
  }

  useEffect(() => {
    fetchData()
  }, []);

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