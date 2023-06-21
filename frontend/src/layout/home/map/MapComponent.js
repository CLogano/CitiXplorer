import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Marker from './Marker';
import CONSTANTS from '../../../constants';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapComponent = (props) => {

  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  const devApiKey = "AIzaSyCj4i7ATOdumVfn3eDuiIbMdzzTxoP2EBE";

  const { data, destination, onSelectedDestination } = props;

  const onSelectedHandler = useCallback((id) => {
    const destination = data.find(destination => {
      return destination.name === id;
    });

    onSelectedDestination(destination);

    if (destination && mapRef.current) {
      mapRef.current.panTo(destination.geometry);

      if (mapRef.current.getZoom() < 14) {
        mapRef.current.setZoom(14);
      }
    }

  }, [data, onSelectedDestination]);

  useEffect(() => {

    if (destination && mapRef.current) {
        mapRef.current.panTo(destination.geometry);

        if (mapRef.current.getZoom() < 14) {
            mapRef.current.setZoom(14);
        }
    }

}, [destination]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          CONSTANTS.apiURL + `/geolocation/location-by-address?address=${props.address}`
        );
        const data = await response.json();
        if (map) {
          map.setCenter(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    console.log("ADDRESS: " + props.address)

    if (props.address && map) {
      fetchLocation();
    }
  }, [props.address, map]);

  //Pan & zoom to first destination when data is fetched
  useEffect(() => {

    if (data && data.length > 0 && mapRef.current) {

        mapRef.current.panTo(data[0].geometry);
        mapRef.current.setZoom(15);
    }
  }, [data]);

  const onLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  };

  const options = {
    clickableIcons: false,
    streetViewControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: "transit.station",
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]
  };

  return (
    <React.Fragment>
      <LoadScript googleMapsApiKey={devApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={props.address ? null : { lat: 0, lng: 0 }}
          zoom={10}
          onLoad={onLoad}
          options={options}
        >
          {data && data.map((d) => (
            <Marker
              key={d.name}
              id={d.name}
              name={d.name}
              description={d.description}
              rating={d.rating}
              selected={destination && d.name === destination.name ? true : false}
              onSelected={onSelectedHandler}
              position={d.geometry}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </React.Fragment>
  );
};

export default MapComponent;