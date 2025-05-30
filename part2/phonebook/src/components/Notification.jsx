const Notification = ({message, type}) => {
    if (message === null || message === '' || type === null || type === '') {
        return null
    }
    return (
        <div className={`${type === 'success' ? 'success' : 'error'} notification`}>
            <p>{message}</p>
        </div>
    )
}

export default Notification