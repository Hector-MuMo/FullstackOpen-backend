const PersonForm = ({ name, number, onChangeName, onChangeNumber, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                name: <input value={name} onChange={(e) => onChangeName(e)} />
            </div>
            <div>
                number: <input value={number} onChange={onChangeNumber} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm