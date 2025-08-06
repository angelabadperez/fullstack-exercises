import { useDispatch } from 'react-redux'

import { filterChange } from '../reducers/filterReducer'

const AnecdoteFilter = () => {
  const dispatch = useDispatch()

  return (
    <div>
        filter <input name='filter' onChange={e => dispatch(filterChange(e.target.value))} />
    </div>
  )
}

export default AnecdoteFilter