const Filter = ({filterName, handleFilterNameChange}) => 
    <div>
        filter shown with: <input value={filterName} onChange={handleFilterNameChange}/>
    </div>

export default Filter