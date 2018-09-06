import React from "react";
import { compose } from "recompose";
import { 
    withScriptjs, 
    withGoogleMap, 
    GoogleMap,
    Marker
} from "react-google-maps";

const CountryMap = compose(
    withScriptjs,
    withGoogleMap
)(props => {
    return (
        <GoogleMap
            defaultZoom={4}
            defaultCenter={{ lat: props.lat, lng: props.lng }}
        >
            <Marker 
                position={{ lat: props.lat, lng: props.lng }} 
                label={{
                    color: "#ffffff",
                    text: props.code,
                    fontSize: "12px"
                }}
                title={props.name}
            />
        </GoogleMap>
    );
});

export default function CountryCapitalMap(props) {
    return (
        <CountryMap 
            {...props}
            googleMapURL={`${process.env.CLIENT_APP_GOOGLE_MAPS_URI}?key=${process.env.CLIENT_APP_GOOGLE_MAPS_KEY}&libraries=places`}
        />
    );
};