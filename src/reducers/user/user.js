const initialState = {
    data: {},
    languages: [],
    configs: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_USER_INFO':
            return {
                ...state,
                data: action.data
            };
        case 'SET_DATA':
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}