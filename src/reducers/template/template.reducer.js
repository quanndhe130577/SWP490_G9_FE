const initialState = {
    entity: [],
}

const template = (state = initialState, action) => {
    switch (action.type) {
        case SET_ENTITY:
            state.entity = action.data;
            return { ...state, entity: action.data };
        default:
            return state;
    }
}

export default template;