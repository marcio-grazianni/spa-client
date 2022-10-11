import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps"
import {StarRating} from '../UI/star-rating'
import {changeMarkerMouseOver} from './actions'
import {DashboardDonut} from '../UI/graphs/dashboard-donut'

class SXIPin extends Component {
  state = {
    hover: false,
    hoverTimer: null,
  }
  componentWillUnmount() {
    clearTimeout(this.state.hoverTimer);
  }
  _setMouseOver() {
    this.setState({hover: true});
    if (this.state.hoverTimer) {
      clearTimeout(this.state.hoverTimer);
    }
  }
  _unsetMouseOver() {
    let hoverTimer = setTimeout(() => {
      this.setState({hover: false});
    }, 500);
    this.setState({hoverTimer});
  }
  _calculateColor() {
    // TODO: use actual rating field from external reviews - will account for decimals?
    const {sxi} = this.props;
    if (sxi > 60) {
      return "5B138D"
    } else if (sxi > 40) {
      return "F2B262"
    } else if (sxi >= 0) {
      return "B6483C"
    } else {
      return "a3a3a3"
    }
  }
  render() {
    const {sxi, rating, breakdown, review_count, position} = this.props;
    const {name, address} = this.props.location_info;
    const {hover} = this.state;

    const color = ::this._calculateColor();

    const pinImage = new google.maps.MarkerImage(`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

    let review_count_str = `${review_count} reviews`;
    if (review_count === 1) { review_count_str = `1 review`};
    return (
      <div>
        <Marker
          position={position}
          icon={pinImage}
          onMouseOver={::this._setMouseOver}
          onMouseOut={::this._unsetMouseOver}
        >
          {
            (hover) &&
              <InfoWindow>
                <div
                  className='info-window'
                  onMouseOver={::this._setMouseOver}
                  onMouseOut={::this._unsetMouseOver}
                >
                  <span className='field name'>{name}<span className='avg-rating'><StarRating rating={rating} /></span></span>
                  <span className='field address'>{address}</span>
                  <span className='field sxi'>
                    <DashboardDonut
                      value={Math.round(sxi)}
                      max={100}
                      label="SXI"
                      donutHeight={90}
                      donutWidth={90}
                      arcColor={`#${color}`}
                      labelColor={`#${color}`}
                    />
                  </span>
                  <span className='field breakdown'>
                    <ul>
                      <li className='advocates'>
                        <img src={Django.static('images/smiles/advocates.svg')} />
                        <span className='score' style={{color: '#5B138D'}}>{`${breakdown.advocates}%`}</span>
                      </li>
                      <li className='neutral'>
                        <img src={Django.static('images/smiles/neutral.svg')} />
                        <span className='score' style={{color: '#F2B262'}}>{`${breakdown.neutral}%`}</span>
                      </li>
                      <li className='adversaries'>
                        <img src={Django.static('images/smiles/adversaries.svg')} />
                        <span className='score' style={{color: '#B6483C'}}>{`${breakdown.adversaries}%`}</span>
                      </li>
                    </ul>
                  </span>
                  <span className='field rating-ct'>Based on {review_count_str}</span>
                </div>
              </InfoWindow>
          }
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
      <SXIPin
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
