import Person from './Person'

const Persons = ({persons, handleDelete}) => {
    return (
        <div>
            { persons.map(person => {
                return <Person key={person.id} person={person} handleDelete={() => handleDelete(person.id)} />
            })}
        </div>
    )
}

export default Persons