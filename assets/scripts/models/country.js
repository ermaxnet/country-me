import store, {
    getCountry,
    setCountry,
    getCountryWeather,
    setCountryWeather,
    getCountryPhotos,
    setCountryPhotos
} from "../store";

export const requestCountry = (country_code = null) => {
    store.dispatch(getCountry());
    if(country_code) {
        return fetch(`/api/get-country-by-code?country_code=${country_code}`)
            .then(response => response.json())
            .then(country => {
                store.dispatch(setCountry(country));
            });
    }
    return fetch("/api/get-my-country", {
        // headers: {
        //     "x-forwarded-for": "178.121.211.243"
        // }
    })
        .then(response => response.json())
        .then(country => {
            store.dispatch(setCountry(country));
        });
};

export const requestWeather = (lat, lng) => {
    store.dispatch(getCountryWeather());
    return fetch(`/api/weather?lat=${lat}&lng=${lng}`)
        .then(response => response.json())
        .then(({ currently }) => {
            store.dispatch(setCountryWeather(currently));
        });
};

export const requestPhotos = (name, capital) => {
    store.dispatch(getCountryPhotos());
    return fetch(`/api/get-country-photos?name=${name}&capital=${capital}`)
        .then(response => response.json())
        .then((photos) => {
            store.dispatch(setCountryPhotos(photos));
        });
};