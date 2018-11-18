import React from "react";
import { NotificationManager } from "react-notifications";
import store, {
    getCountry,
    setCountry,
    getCountryWeather,
    setCountryWeather,
    getCountryPhotos,
    setCountryPhotos,
    setErrorState
} from "../store";
import locale from "../../../locales";

const processCountryApiResponse = response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error(locale.t("Common API Exception"));
};

const showErrorNotification = message => {
    store.dispatch(setErrorState());
    return NotificationManager.error(message, locale.t("Bad response"), 5000);
};

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
        /* headers: {
            "x-forwarded-for": "178.121.219.20"
        } */
    })
        .then(response => processCountryApiResponse(response))
        .then(country => {
            store.dispatch(setCountry(country));
        })
        .catch(err => showErrorNotification(err.message));
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