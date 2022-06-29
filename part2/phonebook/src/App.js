import {useEffect, useState} from 'react'
import {Persons} from "./components/Persons";
import {Filter} from "./components/Filter";
import {PersonForm} from "./components/PersonsForm";
import personService from "./services/persons"
const Notification = ({ message }) => {
  if (message === null) {
    return null
  } else {
    const {content, className} = message
    return (
        <div className={className}>
          {content}
        </div>
    )
  }
}
const App = () => {
  const [message, setMessage] = useState(null)
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [display, setDisplay] = useState([])
  const [filter, setFilter] = useState('')
  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }
  const handleFilterChange = e => {
    setFilter(e.target.value)
    setDisplay(persons.filter(x => x.name.toLowerCase().includes(e.target.value)))
  }
  const handleNumberChange = e => {
    setNumber(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const matchingPersons = persons.filter(x => x.name === newName)
    if (matchingPersons.length === 0) {
      const newPerson = {'name': newName, 'number': number}

      personService.create(newPerson).then((response) => {
        const newPersons = [...persons, response.data]
        setPersons(newPersons)
        setMessage({content: `Added ${newPerson.name}`, className: "success"})
        setTimeout(() => setMessage(null), 5000)
      }).catch(e => {
        console.log(e.response.data)
        setMessage({content: e.response.data.error, className: "error"})
        setTimeout(() => setMessage(null), 5000)
      })
    } else {
      const updatedPerson = {...matchingPersons[0], 'number': number}
      handleUpdate(updatedPerson.id, updatedPerson)
    }
  }
  const fetchData = () => {
    personService.getAll().then(response => setPersons(response.data))
  }

  const handleDelete = id => {
    const toDeleteName = persons.filter(person => person.id === id)[0].name
    if (window.confirm(`Do you want to delete ${toDeleteName}?`)) {
      const newPersons = persons.filter(person => person.id !== id)
      personService.deletePerson(id).then(() => setPersons(newPersons))
    }
  }

  const handleUpdate = (id, updatedPerson) => {
    if (window.confirm(`${updatedPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
      personService.update(id, updatedPerson).then(response => {
        setPersons(persons.map(person => person.id !== id? person: response.data))
      }).catch(e => {
        console.log(e.response.data.error)
        setMessage({content: e.response.data.error, className: 'error'})
      })
    }
  }
  useEffect(() => {
    fetchData()
  }, []);

  return (
      <div>
        <h2>Phonebook</h2>
        <Notification message={message}/>
        <Filter onChange={handleFilterChange}/>
        <h2> add a new </h2>
        <PersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
                    handleSubmit={handleSubmit}/>
        <h2>Numbers</h2>
        <Persons filter={filter} display={display} persons={persons} handleDelete={handleDelete}/>
      </div>
  )
}

export default App