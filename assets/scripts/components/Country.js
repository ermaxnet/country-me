import React, { Component as ReactComponent } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import store from "../store";
import {
    requestCountry
} from "../models/country";
import ReactNumber from "react-number-format";
import { NotificationContainer } from "react-notifications";
import CountryCapitalMap from "./GoogleMap";
import "components/Country.scss";
import "react-notifications/lib/notifications.css";
import locale from "../../../locales";

class CountryComponent extends ReactComponent {
    componentDidMount() {
        requestCountry();
    }
    render() {
        const { isFetching, country, error } = this.props;
        if(error || isFetching || country === null) {
            return null;
        }
        const { hasCoords } = country;
        return (
            <div className="Country">
                {hasCoords && (
                    <CountryCapitalMap 
                        lat={country.latlng[0]}
                        lng={country.latlng[1]}
                        code={country.alpha2Code}
                        name={country.name}
                        capital={country.capital}
                        containerElement={<figure className="CountryMap"></figure>}
                        loadingElement={<div style={{ height: "100%" }} />}
                        mapElement={<div style={{ height: "100%" }} />}
                    />
                )}
                <div className="CountryInfo">
                    <figure className="CountryFlag__container">
                        <img 
                            className="CountryFlag" 
                            src={country.flag}
                            alt={country.name}
                        />
                    </figure>
                    <div className="CountryInfo__container">
                        <span className="CountryName">{country.name}</span>
                        <span className="CountryCapital">{country.capital}</span>
                    </div>
                </div>
                <dl className="CountryShortInfo">
                    {!!(country.region || country.subregion) && (
                        <>
                            <dt className="CountryShortInfo__key">{locale.t("short_info.region")}</dt>
                            <dd className="CountryShortInfo__value">{country.region} &middot; {country.subregion}</dd>
                        </>
                    )}
                    {hasCoords && (
                        <>
                            <dt className="CountryShortInfo__key">{locale.t("short_info.coordinates")}</dt>
                            <dd className="CountryShortInfo__value">{country.latlng[0]} &deg; {country.latlng[1]} &deg;</dd>
                        </>
                    )}
                    {!!country.population && (
                        <>
                            <dt className="CountryShortInfo__key">{locale.t("short_info.population")}</dt>
                            <dd className="CountryShortInfo__value">
                                <ReactNumber 
                                    value={country.population} 
                                    type="text"
                                    displayType="text"
                                    thousandSeparator={" "}
                                />
                            </dd>
                        </>
                    )}
                    {!!country.area && (
                        <>
                            <dt className="CountryShortInfo__key">{locale.t("short_info.area")}</dt>
                            <dd className="CountryShortInfo__value">
                                <ReactNumber 
                                    value={country.area} 
                                    type="text"
                                    displayType="text"
                                    suffix=" sq km"
                                    thousandSeparator={" "}
                                />
                            </dd>
                        </>
                    )}
                </dl>
                {!!(country.regionalBlocs && country.regionalBlocs.length) && (
                    <dl className="CountryShortInfo">
                        <dt className="CountryShortInfo__key">{locale.t("short_info.blocs")}</dt>
                        <dd className="CountryShortInfo__value">
                            {country.regionalBlocs.map(block => 
                                <a 
                                    key={block._id}
                                    className="CountryRegionalBloc"
                                    href={`#${block.acronym}`}
                                >{block.name}</a>
                            )}
                        </dd>
                    </dl>
                )}
            </div>
        );
    }
};

const mapStateToProps = state => ({
    isFetching: state.country.get("isFetching"),
    country: state.country.get("model"),
    error: state.exception.get("error")
});

const CountryReduxComponent = connect(
    mapStateToProps
)(CountryComponent);

ReactDOM.render(
    <Provider store={store}>
        <CountryReduxComponent />
    </Provider>,
    document.getElementById("country")
);

ReactDOM.render(
    <NotificationContainer />,
    document.getElementById("notifications")
);

const ExceptionComponent = ({ error })=> {
    if(error) {
        return (
            <div className="Exception">
                <span>Sorry...</span>
            </div>
        );
    }
    return null;
};

const ExceptionReduxComponent = connect(
    mapStateToProps
)(ExceptionComponent);

ReactDOM.render(
    <Provider store={store}>
        <ExceptionReduxComponent />
    </Provider>,
    document.getElementById("exception")
);