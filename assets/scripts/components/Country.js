import React, { Component as ReactComponent } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import store from "../store";
import {
    requestCountry
} from "../models/country";
import ReactNumber from "react-number-format";
import "components/Country.scss";
import locale from "../../../locales";

class CountryComponent extends ReactComponent {
    componentDidMount() {
        requestCountry();
    }
    render() {
        if(this.props.isFetching) {
            return <span>Loading...</span>;
        }
        const { country } = this.props;
        if(country === null) {
            return null;
        }
        console.log(country);
        return (
            <div className="Country">
                <figure className="CountryMap"></figure>
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
                    {!!(country.latlng && country.latlng.length === 2) && (
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
    country: state.country.get("model")
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