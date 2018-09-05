import {
    createStore,
    combineReducers
} from "redux";
import { REDUX_ACTION } from "./constants";
import { Record } from "immutable";

export const getCountry = () => {
    return {
        type: REDUX_ACTION.GET_COUNTRY_REQUEST
    };
};

export const setCountry = country => {
    return {
        type: REDUX_ACTION.GET_COUNTRY_SUCCESS,
        country
    };
};

const CountryState = Record({
    isFetching: false,
    model: null
});

const countryReducer = (state = new CountryState(), action) => {
    switch(action.type) {
        case REDUX_ACTION.GET_COUNTRY_REQUEST: {
            return state.set("isFetching", true);
        }
        case REDUX_ACTION.GET_COUNTRY_SUCCESS: {
            return state
                .set("isFetching", false)
                .set("model", action.country);
        }
    }
    return state;
};

const reducer = combineReducers({
    country: countryReducer
});

const store = createStore(reducer);
export default store;