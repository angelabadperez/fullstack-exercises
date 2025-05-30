const LanguagesList = ({languages}) => {
    return (
        <div>
            <h2>Languages</h2>
            <ul>
                {Object.values(languages).map((language, index) => <li key={index}>{language}</li>)}
            </ul>
        </div>
    )
}

export default LanguagesList