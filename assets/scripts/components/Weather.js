import React, { Component as ReactComponent } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { Provider, connect } from "react-redux";
import store from "../store";
import { requestWeather } from "../models/country";
import "components/Weather.scss";
import locale from "../../../locales";

class WeatherComponent extends ReactComponent {
    componentWillReceiveProps(props) {
        if(props.weather.done || props.isFetching || !props.hasCoords) {
            return;
        }
        const [ lat, lng ] = props.coordinates;
        requestWeather(lat, lng);
    }
    render() {
        const { 
            isFetching, 
            coordinates, 
            capital, 
            hasCoords,
            weather: {
                model: weather
            }
        } = this.props;
        if(isFetching || !hasCoords || weather === null) {
            return null;
        }
        const time = moment(Date.now());
        const icon = `<use xlink:href="/media/icons/weather.svg#${weather.icon}" />`;
        return (
            <div className="CountryWeater">
                <div className="CountryWeater__header">
                    <h3 className="WeaterPlace">
                        {locale.t("weather_in")}&nbsp;{capital}
                    </h3>
                    <time className="WeaterTime">
                        {time.format("dddd HH:mm")}
                    </time>
                </div>
                <div className="Weater">
                    <div className="WeaterIcon">
                        <svg 
                            dangerouslySetInnerHTML={{ __html: icon }}
                            style={{ width: "100%", height: "100%" }}
                            viewBox="0 0 100 100"
                            preserveAspectRatio="xMidYMid slice"
                        ></svg>
                    </div>
                    <span className="WeatherDegree">
                        {Math.ceil(weather.temperature)}
                        <span className="WeatherDegreeType">&#8451;</span>
                    </span>
                </div>
                <dl className="WeatherInfo">
                    <dd className="WeatherInfo__value">
                        {weather.summary}
                    </dd>
                    <dt className="WeatherInfo__key">
                        {locale.t("weather_info.precip_probability")}
                    </dt>
                    <dd className="WeatherInfo__value">
                        {Math.ceil(weather.precipProbability * 100)} %
                    </dd>
                    <dt className="WeatherInfo__key">
                        {locale.t("weather_info.humidity")}
                    </dt>
                    <dd className="WeatherInfo__value">
                        {Math.ceil(weather.humidity * 100)} %
                    </dd>
                    <dt className="WeatherInfo__key">
                        {locale.t("weather_info.windSpeed")}
                    </dt>
                    <dd className="WeatherInfo__value">
                        {Math.ceil(weather.windSpeed)} {locale.t("km_p_h")}
                    </dd>
                </dl>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isFetching: state.country.get("isFetching"),
    coordinates: state.country.getIn([ "model", "latlng" ]),
    capital: state.country.getIn([ "model", "capital" ]),
    hasCoords: state.country.getIn([ "model", "hasCoords" ]),
    weather: state.weather.toJS()
});

const WeatherReduxComponent = connect(
    mapStateToProps
)(WeatherComponent);

ReactDOM.render(
    <Provider store={store}>
        <WeatherReduxComponent />
    </Provider>,
    document.getElementById("weather")
);