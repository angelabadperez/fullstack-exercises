import axios from 'axios'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import { useEffect, useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notification, setNotification] = useState({message: '', type: ''})

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = filterName === '' ? persons : persons.filter(person => {
    return person.name.toLowerCase().includes(filterName.toLowerCase())}
  )

  const resetNotification = () => { 
    setTimeout(() => {
      setNotification({message: '', type: ''})
    }, 5000)
  }

  const handleFilterNameChange = event => {
    setFilterName(event.target.value)
  }

  const handleSubmitForm = event => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) { 
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) { 
        updatePerson()
        return
      }
      return
    }
    const nameObject = {
      name: newName,
      number: newNumber
    }
    personsService
      .create(nameObject)
      .then(createdPerson => {
        setNotification({message: `Added ${createdPerson.name}`, type: 'success'})
        resetNotification()
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const updatePerson = () => { 
    const personToUpdate = persons.find(person => person.name === newName)
    const updatedPerson = { ...personToUpdate, number: newNumber }
    personsService
      .update(personToUpdate.id, updatedPerson)
      .then(returnedPerson => {
        setNotification({message: `Updated ${returnedPerson.name}`, type: 'success'})
        resetNotification()
        setPersons(persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setNotification({message: `Information of ${personToUpdate.name} has already been removed from server`, type: 'error'})
        resetNotification()
        setPersons(persons.filter(person => person.id !== personToUpdate.id))
      })
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleDelete = id => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          alert(`Information of ${personToDelete.name} has already been removed from server`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filterName={filterName} handleFilterNameChange={handleFilterNameChange}/>
      <h2>add a new</h2>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        handleSubmitForm={handleSubmitForm}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App