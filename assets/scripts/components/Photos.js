import React, { Component as ReactComponent } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import store from "../store";
import Loader from "./Loader";
import Photo from "./Photo";
import { requestPhotos } from "../models/country";
import "components/Photos.scss";

class PhotosComponent extends ReactComponent {
    componentWillReceiveProps(props) {
        if(props.photos.done || props.isFetching) {
            return;
        }
        const { name, capital } = props;
        requestPhotos(name, capital);
    }
    render() {
        const { 
            isFetching,
            photos: { items: photos }
        } = this.props;
        if(isFetching) {
            return <Loader />
        }
        if(!photos) {
            return null;
        }
        return (
            <ol className="Photos">
                {photos.map(photo => 
                    <Photo key={photo.id} photo={photo} />
                )}
            </ol>
        );
    }
};

const mapStateToProps = state => ({
    isFetching: state.country.get("isFetching"),
    name: state.country.getIn([ "model", "name" ]),
    capital: state.country.getIn([ "model", "capital" ]),
    photos: state.photos.toJS()
});

const PhotosReduxComponent = connect(
    mapStateToProps
)(PhotosComponent);

ReactDOM.render(
    <Provider store={store}>
        <PhotosReduxComponent />
    </Provider>,
    document.getElementById("photos")
);