const Filter = ({ filter, onChange }) => {
    return (
        <div>
            Filter shown with <input type="text" value={filter} onChange={e => onChange(e)} />
        </div>
    )
}

export default Filter