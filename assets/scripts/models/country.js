import store, {
    getCountry,
    setCountry
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