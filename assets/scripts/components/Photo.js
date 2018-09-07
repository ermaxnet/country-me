import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import locale from "../../../locales";
import ReactNumber from "react-number-format";

class Photo extends ReactComponent {
    static propTypes = {
        photo: PropTypes.object.isRequired
    }

    onLoaded() {
        const padding = (this.image.height / this.image.width) * 100;
        this.adaptive.style.paddingBottom = `${padding}%`;
        this.image.style.display = "block";
    }
    render() {
        const { photo } = this.props;
        const photoURI = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`;
        const time = moment(1000 * photo.dateupload);
        return (
            <li className="Photo">
                <div className="PhotoMessage">
                    <div className="PhotoContext">
                        <header className="PhotoHeader">
                            {!!(photo.iconfarm && photo.iconserver) 
                                ? (
                                    <img 
                                        className="PhotoHeaderImage" 
                                        src={`http://farm${photo.iconfarm}.staticflickr.com/${photo.iconserver}/buddyicons/${photo.owner}.jpg`}
                                        alt={`FLICKR_${photo.owner} ${photo.ownername}`}
                                    />
                                )
                                : (
                                    <img 
                                        className="PhotoHeaderImage" 
                                        src="https://www.flickr.com/images/buddyicon.gif"
                                        alt={`FLICKR_${photo.owner} ${photo.ownername}`}
                                    />
                                )
                            }
                            <span className="PhotoHeaderName">{photo.ownername}</span>
                            <span className="PhotoHeaderTime">&nbsp;&middot;&nbsp;{time.fromNow()}</span>
                        </header>
                        <figure className="PhotoImage">
                            {photo.title && photo.description && (
                                <figcaption className="PhotoDescriptions">
                                    <span className="PhotoTitle">{photo.title}</span>
                                    {photo.description && (
                                        <span className="PhotoText" dangerouslySetInnerHTML={{ __html: photo.description._content }}></span>
                                    )}
                                </figcaption>
                            )}
                            <div className="AdaptiveContainer">
                                <div 
                                    ref={adaptive => { this.adaptive = adaptive; }}
                                    className="AdaptiveContainerPhotos"
                                >
                                    <img 
                                        ref={image => { this.image = image; }}
                                        className="PhotoPreview" 
                                        src={photoURI} 
                                        alt={`FLICKR_${photo.id}`} 
                                        onLoad={this.onLoaded.bind(this)}
                                    />
                                </div>
                            </div>
                        </figure>
                        {!!photo.views && (
                            <div className="PhotoViews">
                                <ReactNumber 
                                    value={photo.views} 
                                    type="text"
                                    displayType="text"
                                    suffix={` ${locale.t("views")}`}
                                    thousandSeparator={" "}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </li>
        );
    }
};

export default Photo;