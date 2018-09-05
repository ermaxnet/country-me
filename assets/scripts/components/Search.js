import React, { Component as ReactComponent } from "react";
import ReactDOM from "react-dom";
import locale from "../../../locales";
import { throttle } from "../../../functions";
import { requestCountry } from "../models/country";
import "components/Search.scss";

class SearchComponent extends ReactComponent {
    state = {
        match: "",
        autocomplete: []
    }

    onChange(e) {
        const parentNode = e.target.parentNode;
        const action = throttle(() => {
            if(this.state.match) {
                return this.onSubmit({
                    target: parentNode,
                    preventDefault: () => {}
                });
            }
            return this.setState({ autocomplete: [] });
        }, 50);
        this.setState({ match: e.target.value }, action);
    }
    onSubmit(e) {
        e.preventDefault();
        fetch(e.target.action + `?match=${this.state.match}`)
            .then(response => response.json())
            .then(countries => {
                this.setState({ autocomplete: countries });
            });
    }
    onSelect(e, country_code, name) {
        e.preventDefault();
        this.setState({ match: name, autocomplete: [] }, () => {
            requestCountry(country_code);
        });
    }
    onFocus(e) {
        if(this.state.match) {
            return this.onSubmit({
                target: e.target.parentNode,
                preventDefault: () => {}
            });
        }
    }
    onBlur() {
        setTimeout(() => this.setState({}), 500);
    }
    render() {
        const showAutocomplete = !!(this.state.match && this.state.autocomplete && this.state.autocomplete.length);
        return (
            <form
                className={`Search__form${showAutocomplete ? " Search--autocompleted" : ""}`}
                action="/api/search"
                onSubmit={this.onSubmit.bind(this)}
                autoComplete="off"
            >
                <input 
                    ref={node => { this.node = node; }}
                    type="text"
                    name="match"
                    value={this.state.match}
                    onChange={this.onChange.bind(this)}
                    onFocus={this.onFocus.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    placeholder={locale.t("search_placeholder")}
                    className="Search__input"
                />
                <span 
                    className="icon icon-search"
                    onClick={e => this.onSubmit({
                        preventDefault: e.preventDefault,
                        target: e.target.parentNode
                    })}
                >
                </span>
                {showAutocomplete && (this.node === document.activeElement) && (
                    <ul className="Search__autocomplete" role="listbox">
                        {this.state.autocomplete.map(country => 
                            <li 
                                key={country._id} 
                                className="CountryAutocomplete"
                                onClick={e => this.onSelect(e, country.alpha3Code, country.name)}
                            >
                                <figure className="CountryItem">
                                    <img className="CountryFlag" src={country.flag} alt={country.name} />
                                    <figcaption className="CountryInfo">
                                        <span className="CountryName">{country.name}</span>
                                        <span className="CountryCapital">{country.capital}</span>
                                    </figcaption>
                                </figure>
                            </li>
                        )}
                    </ul>
                )}
            </form>
        );
    }
};

ReactDOM.render(
    <SearchComponent />,
    document.getElementById("search")
);