import { useState, useEffect } from 'react'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import PersonsList from './components/PersonsList';
import personsService from './services/personsRequests'
import Person from './components/Person';
import Notification from './components/Notification';


const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [personsFiltered, setPersonsFiltered] = useState([]);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [isSucceed, setIsSuceed] = useState('success');

    const handleChangeName = (e) => {
        setNewName(e.target.value);
    }

    const handleChangeNumber = (e) => {
        setNewNumber(e.target.value);
    };

    const handleFilterList = (e) => {
        const regEx = new RegExp(e.target.value, 'i');

        const filteredList = persons.filter(person => regEx.test(person.name));
        console.log(filteredList);

        setPersonsFiltered(filteredList);
        setFilter(e.target.value);

    }

    const handleSubmitPerson = (e) => {
        e.preventDefault();

        if (newName.length !== 0 & newNumber.length !== 0) {
            const isNameIncluded = persons.find(item => item.name === newName);
            const isNumberIncluded = persons.find(item => item.number === newNumber);
            const newPerson = {
                name: newName,
                number: newNumber
            }

            if (isNameIncluded !== undefined | isNumberIncluded !== undefined) {
                const confirmUpdate = window.confirm(`${newName} or ${newNumber} is already added to phonebook, replace the info?`);
                const personId = isNameIncluded?.id ?? isNumberIncluded?.id
                console.log(personId);

                if (confirmUpdate) {
                    personsService.update(personId, newPerson).
                        then(personUpdated => {
                            setPersons(persons.map(person => person.id === personUpdated.id ? personUpdated : person));
                            setIsSuceed('success');
                            setNotificationMessage(`Updated ${personUpdated.name}`);
                            setNewName('');
                            setNewNumber('');
                            setShowNotification(true);
                        }).
                        catch(error => {
                            console.log(error);
                            setIsSuceed('error');
                        }).finally(
                            setTimeout(() => {
                                setShowNotification(false);
                            }, 5000)
                        )
                }

            } else {

                personsService.create(newPerson).
                    then(personCreated => {
                        setPersons([...persons, personCreated]);
                        setIsSuceed('success');
                        setNotificationMessage(`Added ${personCreated.name}`);
                        setNewName('');
                        setNewNumber('');
                        setShowNotification(true);
                    }).
                    catch(error => {
                        console.log(error);
                        setIsSuceed('error');
                    }).finally(
                        setTimeout(() => {
                            setShowNotification(false);
                        }, 5000)
                    )
            }

        } else {
            alert('Name or Number is missing');
        }
    }

    const handleDeletePerson = (id, name) => {
        const confirmDelete = window.confirm(`Delete ${name}?`);

        if (confirmDelete) {
            personsService.erase(id).
                then(personDeleted => {
                    console.log(personDeleted);
                    setPersons(persons.filter(person => person.id !== personDeleted.id));
                    setIsSuceed('success');
                    setNotificationMessage(`Deleted ${name}`);
                    setShowNotification(true);
                }).
                catch(error => {
                    console.log(error);
                    setIsSuceed('error');
                    setNotificationMessage(`${name} info has already deleted from the server.`);
                    setShowNotification(true);
                })
                .finally(
                    setTimeout(() => {
                        setShowNotification(false);
                    }, 5000)
                )
        }
    }

    useEffect(() => {
        personsService.getAll().then(initialPersons => {
            setPersons(initialPersons);
        });

    }, [notificationMessage])


    const personsList = filter === ''
        ? persons.map((item, index) => <Person key={index} person={item} onClick={handleDeletePerson} />)
        : personsFiltered.map((item, index) => <Person key={index} person={item} onClick={handleDeletePerson} />)

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} onChange={handleFilterList} />
            <h2>Add new</h2>
            {showNotification &&
                <Notification message={notificationMessage} isSucceed={isSucceed} />
            }
            <PersonForm
                name={newName} number={newNumber}
                onChangeName={handleChangeName} onChangeNumber={handleChangeNumber}
                onSubmit={handleSubmitPerson} />
            <h2>Numbers</h2>
            <PersonsList list={personsList} />
        </div>
    )
}

export default App