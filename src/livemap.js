import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import driver from './assets/driver.png';

class Map extends React.Component {
  state = {
    selectedLocation: null,
  };

  render() {
    const bounds = new window.google.maps.LatLngBounds();
    const locations = this.props.locations;
    
    const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

    for (var i = 0; i < locations.length; i++) {
      bounds.extend(locations[i]);
    };
    this.map && this.map.fitBounds(bounds);

    return (
      <Locate panTo={panTo} />
      <GoogleMap ref={elem => this.map = elem} >
        {this.props.locations.map((location, index) => (
          <Marker
            icon={{
              url: driver,
              scaledSize: { width: 35, height: 44 },
            }}
            key={index}
            position={{ ...location }}
            onClick={() => this.setState({ selectedLocation: location })}
          >
            {this.state.selectedLocation === location &&
              <InfoWindow onCloseClick={() => this.setState({ selectedLocation: null })}>
                <div style={{ color: 'black' }}>
                  {location.lat}, {location.lng} 
                </div>
              </InfoWindow>
            }
          </Marker>
        ))}
      </GoogleMap>
    );
  }
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
}


const LiveMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(Map);
export default LiveMap;
