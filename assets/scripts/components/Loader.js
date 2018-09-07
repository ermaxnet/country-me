import React from "react";
import "components/Loader.scss";

export default function Loader() {
    return (
        <div className="Loader">
            <div className="LoaderSpinner">
                <div className="LoaderSpinner__Layer1"></div>
                <div className="LoaderSpinner__Layer2"></div>
            </div>
        </div>
    );
};