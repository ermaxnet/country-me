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

export const getCountryWeather = () => {
    return {
        type: REDUX_ACTION.GET_COUNTRY_WEATHER_REQUEST
    };
};

export const setCountryWeather = weather => {
    return {
        type: REDUX_ACTION.GET_COUNTRY_WEATHER_SUCCESS,
        weather
    };
};

export const getCountryPhotos = () => {
    return {
        type: REDUX_ACTION.GET_COUNTRY_PHOTOS_REQUEST
    };
}

export const setCountryPhotos = (photos) => {
    return {
        type: REDUX_ACTION.GET_COUNTRY_PHOTOS_SUCCESS,
        photos
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
            const hasCoords = !!(action.country.latlng && action.country.latlng.length === 2);
            return state
                .set("isFetching", false)
                .set("model", action.country)
                .setIn([ "model", "hasCoords" ], hasCoords);
        }
    }
    return state;
};

const WeatherState = Record({
    done: false,
    model: null
});

const weatherReducer = (state = new WeatherState(), action) => {
    switch(action.type) {
        case REDUX_ACTION.GET_COUNTRY_REQUEST:
        case REDUX_ACTION.GET_COUNTRY_WEATHER_REQUEST: {
            return state.set("done", false);
        }
        case REDUX_ACTION.GET_COUNTRY_WEATHER_SUCCESS: {
            return state
                .set("done", true)
                .set("model", action.weather);
        }
    }
    return state;
};

const PhotosState = Record({
    done: false,
    items: null
});

const photosReducer = (state = new PhotosState(), action) => {
    switch(action.type) {
        case REDUX_ACTION.GET_COUNTRY_REQUEST:
        case REDUX_ACTION.GET_COUNTRY_PHOTOS_REQUEST: {
            return state
                .set("done", false)
                .set("items", null);
        }
        case REDUX_ACTION.GET_COUNTRY_PHOTOS_SUCCESS: {
            return state
                .set("done", true)
                .set("items", action.photos);
        }
    }
    return state;
};

const reducer = combineReducers({
    country: countryReducer,
    weather: weatherReducer,
    photos: photosReducer
});

const store = createStore(reducer);
export default store;