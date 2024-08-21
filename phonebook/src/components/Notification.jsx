

const Notification = ({ message, isSucceed }) => {
    return (
        <div className={isSucceed === 'success' ? 'success' : 'error'}>{message}</div>
    )
}

export default Notification