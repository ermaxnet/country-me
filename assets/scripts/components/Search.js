import React, { Component as ReactComponent } from "react";
import ReactDOM from "react-dom";
import locale from "../../../locales";
import "components/Search.scss";

class SearchComponent extends ReactComponent {
    state = {
        match: ""
    }

    onChange(e) {
        this.setState({ match: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
    }
    render() {
        return (
            <form
                className="Search__form"
                action="/search"
                onSubmit={this.onSubmit.bind(this)}
            >
                <input 
                    type="text"
                    name="match"
                    value={this.state.match}
                    onChange={this.onChange.bind(this)}
                    placeholder={locale.t("search_placeholder")}
                    className="Search__input"
                />
                <span className="icon icon-search"></span>
            </form>
        );
    }
};

ReactDOM.render(
    <SearchComponent />,
    document.getElementById("search")
);