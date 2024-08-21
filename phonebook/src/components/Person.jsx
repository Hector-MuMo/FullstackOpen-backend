const Person = ({ person, onClick }) => {

    return (
        <>
            {person
                ?
                <p>{person.name} {person.number} <button onClick={() => onClick(person.id, person.name)}>delete</button></p>
                :
                null
            }
        </>
    )
}

export default Person