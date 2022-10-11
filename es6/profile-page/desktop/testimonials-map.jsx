import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps"

class SimplePin extends Component {
  render() {
    const {position} = this.props;
    const {name, address} = this.props.location_info;

    const color = "4192b6";

    const pinImage = new google.maps.MarkerImage(`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

    return (
      <div>
        <Marker
          position={position}
          icon={pinImage}
        >
        </Marker>
      </div>
    );
  }
}

@withGoogleMap
@branch({
  markers: ['locations', 'markers'],
})
class MapComponent extends Component {
  render() {
    const {markers} = this.props;
    const MarkerComponents = markers.map((marker) =>
      <SimplePin
        key={marker.id}
        {...marker}
      />
    );
    return (
      <GoogleMap
        ref={this.props.onMapLoad}
        onIdle={this.props.onMapIdle}
        defaultZoom={3}
        defaultCenter={{lat: 0, lng: 0}}
        onClick={this.props.onMapClick}
      >
        {MarkerComponents}
      </GoogleMap>
    );
  }
}

@branch({
  markers: ['locations', 'markers'],
})
class LocationsMap extends Component {
  _setBounds(googleMap) {
    const {markers} = this.props;
    let bounds = new google.maps.LatLngBounds();
    markers.forEach((marker) => {
      bounds.extend(marker.position);
      let marker2 = {
        position: {
          lat: marker.position.lat + 0.0005,
          lng: marker.position.lng + 0.0005
        }
      }
      bounds.extend(marker2.position);
      let marker3 = {
        position: {
          lat: marker.position.lat - 0.0005,
          lng: marker.position.lng - 0.0005
        }
      }
      bounds.extend(marker3.position);
    });
    googleMap.fitBounds(bounds);
  }
  render() {
    return (
      <div className='locations-map'>
        <MapComponent
          onMapLoad={(googleMap) => {
            if (googleMap) {
              ::this._setBounds(googleMap);
            }
          }}
          onMapIdle={(googleMap) => {
            console.log('map did idle')
          }}
          containerElement={
            <div style={{ height: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
        />
      </div>
    );
  }
}

export { LocationsMap }
