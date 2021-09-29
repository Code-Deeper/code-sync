
import { ADD_USER, REMOVE_USER, ADD_USER_ERROR, REMOVE_USER_ERROR, AUTHORIZATION} from '../Constant/UserConst'
const initialState = {
    loading: true,
    data: []
}

export default function (state = initialState, action) {
    // const history = useHistory()
    switch (action.type) {
        case ADD_USER:
            localStorage.setItem('authUser', JSON.stringify({...action?.payload}))
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        case ADD_USER_ERROR:
            return {
                ...state,
                loading: false,
                
            }
        case REMOVE_USER:
            localStorage.clear()
            return {
                ...state,
                loading: false,
                data: null
            }
        case REMOVE_USER_ERROR:
            return {
                ...state,
                loading: false,
            }
        case AUTHORIZATION:
            localStorage.setItem('authUser', JSON.stringify({ ...action?.payload }))
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        default:
            return state;
    }
}