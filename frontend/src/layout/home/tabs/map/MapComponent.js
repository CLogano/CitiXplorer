import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Marker from './Marker';
import CONSTANTS from '../../../../constants';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapComponent = React.forwardRef((props, ref) => {

  const [map, setMap] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [clickedMarker, setClickedMarker] = useState(false);
  const mapRef = useRef(null);

  const devApiKey = "AIzaSyCj4i7ATOdumVfn3eDuiIbMdzzTxoP2EBE";

  const { data, destination, onSelectedDestination } = props;

  const onSelectedHandler = useCallback((id) => {
    const destination = data.find(destination => {
      return destination.name === id;
    });

    setClickedMarker(true);
    onSelectedDestination(destination);

    if (destination && mapRef.current) {
      mapRef.current.panTo(destination.geometry);

      if (mapRef.current.getZoom() < 13) {
        mapRef.current.setZoom(13);
      }
    }

  }, [data, onSelectedDestination]);

  const markerClickHandler = useCallback((id) => {

    setClickedMarker(true);

    onSelectedHandler(id);

  }, [onSelectedHandler]);

  const fetchCityName = async (lat, lng) => {

    try {
      const response = await fetch(CONSTANTS.apiURL + `/geonames/nearest-city?lat=${lat}&lng=${lng}`);
      const cityName = await response.json();

      return cityName;

    } catch (error) {
      console.error(error);
    }
  };

  const clickCityHandler = async (event) => {

    if (clickedMarker) {
      setClickedMarker(false);
      return;
    }

    const clickedCity = await fetchCityName(event.latLng.lat(), event.latLng.lng());

    if (!Array.isArray(clickedCity)) {
      props.clickedCity(clickedCity);
    } else {
      console.log("No city corresponding to these coordinates");
    }
    
    setClickedMarker(false);
  };

  const forceMapUpdate = () => {
    setForceUpdate(!forceUpdate);
  };

  useImperativeHandle(ref, () => ({
    forceMapUpdate,
  }));

  useEffect(() => {

    if (destination && mapRef.current) {
        mapRef.current.panTo(destination.geometry);

        if (mapRef.current.getZoom() < 13) {
            mapRef.current.setZoom(13);
        }
    }

}, [destination]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        
        const response = await fetch(
          CONSTANTS.apiURL + `/googleMaps/location-by-address?address=${props.address.name}`
        );
        const data = await response.json();
        if (map) {
          console.log("INCORRECT PANNING")
          map.setCenter(data);
          if (mapRef.current.getZoom() < 9) {
            mapRef.current.setZoom(9);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };


    if (props.address && map) {
      fetchLocation();
    }
  }, [props.address, map, forceUpdate]);

  //Pan & zoom to first destination when data is fetched
  useEffect(() => {

    if (data && data.length > 0 && mapRef.current) {

        mapRef.current.panTo(data[0].geometry);
        mapRef.current.setZoom(12);
    }
  }, [data]);

  const onLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  };

  const options = {
    clickableIcons: false,
    streetViewControl: false,
    zoomControl: false,
    disableDoubleClickZoom: true,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180
      }
    },
    minZoom: 3,
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
          zoom={4}
          onLoad={onLoad}
          options={options}
          onClick={clickCityHandler}
        >
          {data && data.map((d) => (
            <Marker
              key={`${d.name}-${d.address}`}
              id={d.name}
              name={d.name}
              description={d.description}
              rating={d.rating}
              selected={destination && d.name === destination.name ? true : false}
              onSelected={markerClickHandler}
              position={d.geometry}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </React.Fragment>
  );
});

export default MapComponent;