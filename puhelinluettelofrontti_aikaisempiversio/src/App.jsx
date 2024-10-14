import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personsService from './services/personsService';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState('');

  useEffect(() => {
    personsService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const handleAddName = (event) => {
    setNewName(event.target.value);
  };

  const handleAddNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personsService
          .updateOne(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setNotificationMessage(`Updated ${newName}'s number`);
            setNotificationType('success');
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            setNotificationMessage(
              `Error: Information of ${newName} has already been removed from the server`
            );
            setNotificationType('error');
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
            setPersons(
              persons.filter((person) => person.id !== existingPerson.id)
            );
          });
      }
      return;
    }

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personsService.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNotificationMessage(`Added ${newName}`);
      setNotificationType('success');
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
      setNewName('');
      setNewNumber('');
    });
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  const deletePerson = (id) => {
    const personId = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${personId.name}?`)) {
      personsService.deleteOne(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setNotificationMessage(`Deleted ${deletePerson.name}`);
        setNotificationType('success');
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} type={notificationType} />

      <Filter filter={filter} handleFilter={handleFilter} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleAddName={handleAddName}
        newNumber={newNumber}
        handleAddNumber={handleAddNumber}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
