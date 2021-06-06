const initialState = {
    token: "",
    userInfo: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_USER_INFO':
            return {
                ...state,
                token: action.token,
                userInfo: action.userInfo

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