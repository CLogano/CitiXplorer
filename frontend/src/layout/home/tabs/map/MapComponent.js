import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Marker from './Marker';
import CONSTANTS from '../../../../constants';
import CityName from './CityName';

const containerStyle = {
  width: "100%",
  height: "100%"
};

const MapComponent = React.forwardRef((props, ref) => {

  const { data, destination, onSelectedDestination, showMarkers, showCityNames, isLoading, tutorialPage } = props;

  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const [forceUpdate, setForceUpdate] = useState(false);
  const [citiesInView, setCitiesInView] = useState([]);
  const cityCache = useRef({});
  const mapRef = useRef(null);
  const mapIdleTimerRef = useRef(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("CITIES IN VIEW: ", citiesInView);
    }
  }, [citiesInView]);

  useEffect(() => {
    if (tutorialPage < 2) {
      setMapCenter({ lat: 0, lng: 0 });
      if (map) {
        map.setZoom(4);
      }
    }
  }, [tutorialPage, map]);

  const fetchCitiesInView = useCallback(async () => {

    try {
      const bounds = mapRef.current.getBounds();
      const center = bounds.getCenter();

      const response = await fetch(CONSTANTS.apiURL + `/geonames/cities-in-view?lat=${center.lat()}&lng=${center.lng()}`);
      const cities = await response.json();

      const citiesWithCache = cities.map(city => {
        const cachedCity = cityCache.current[city.name];
        if (cachedCity && cachedCity.lat === city.lat && cachedCity.lng === city.lng) {
          return cachedCity;
        }
        cityCache.current[city.name] = city;
        return city;
      });

      if (JSON.stringify(citiesWithCache) !== JSON.stringify(citiesInView)) {
        setCitiesInView(citiesWithCache);
      }
    } catch (error) {

      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
    }

  }, [citiesInView]);

  const onMapIdle = useCallback(() => {
    
    if (!mapRef.current || !showCityNames) {
      return;
    }

    if (mapIdleTimerRef.current) {
      clearTimeout(mapIdleTimerRef.current);
    }
    mapIdleTimerRef.current = setTimeout(() => {
      if (mapRef.current.getZoom() >= 12) {
        fetchCitiesInView();
      } else {
        if (citiesInView && citiesInView.length > 0) {
          setCitiesInView([]);
        }
      }
    }, 500);
    
  }, [fetchCitiesInView, citiesInView, showCityNames]);

  useEffect(() => {
    return () => {
      if (mapIdleTimerRef.current) {
        clearTimeout(mapIdleTimerRef.current);
      }
    }
  }, []);

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const onSelectedMarkerHandler = useCallback((id) => {
    const destination = data.find(destination => {
      return destination.name === id;
    });

    onSelectedDestination(destination);

    if (destination && map) {
      map.panTo(destination.geometry);

      if (map.getZoom() < 13) {
        map.setZoom(13);
      }
    }

  }, [data, onSelectedDestination, map]);

  const markerClickHandler = useCallback((id) => {
    onSelectedMarkerHandler(id);
  }, [onSelectedMarkerHandler]);

  const { clickedCity } = props;
  const onSelectedCityHandler = useCallback((id) => {
    const city = citiesInView.find(city => {
      return city.geonameId === id;
    });

    clickedCity(city);

    if (city && map) {

      map.panTo({ lat: city.lat, lng: city.lng });

      if (map.getZoom() < 12) {
        map.setZoom(12);
      }
    }

  }, [citiesInView, map, clickedCity]);

  const cityClickHandler = useCallback((id) => {
    onSelectedCityHandler(id);
  }, [onSelectedCityHandler]);

  const forceMapUpdate = () => {
    setForceUpdate(!forceUpdate);
  };

  useImperativeHandle(ref, () => ({
    forceMapUpdate,
  }));

  //Center on selected destination
  useEffect(() => {

    if (destination && map && !isLoading) {
      map.panTo(destination.geometry);
      if (map.getZoom() < 13) {
        map.setZoom(13);
      }

    }
}, [destination, map, isLoading]);

  const { address } = props;
    useEffect(() => {
      if (address && map) {
        //Recenter map
        setMapCenter({ lat: address.lat, lng: address.lng});
        if (map.getZoom() < 12) {
          map.setZoom(12);
        }
      }
    }, [address, map, forceUpdate]);

  const onLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);

    if (address) {
      setMapCenter({ lat: address.lat, lng: address.lng });
    }
  };

  const options = {
    clickableIcons: false,
    streetViewControl: false,
    zoomControl: false,
    disableDoubleClickZoom: false,
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
      },
      {
        featureType: "administrative",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "administrative.locality",
        elementType: "labels",
        stylers: [{visibility: "off"}]
      }
    ]
  };

  let markers = <div></div>;
  if (data) {
    markers = data && data.map((d) => (
      <Marker
        key={`${d.name}-${d.address}`}
        id={d.name}
        name={d.name}
        selected={destination && d.name === destination.name ? true : false}
        onSelected={markerClickHandler}
        position={d.geometry}
        show={showMarkers && !isLoading}
      />
    ));
  }
  let cityNames = <div></div>;
  if (citiesInView && citiesInView.length > 0) {
    cityNames = citiesInView.map((city) => (
      <CityName
        key={`${city.lat}-${city.lng}`}
        id={city.geonameId}
        name={city.name}
        selected={address && city.name === address.name ? true : false}
        onSelected={cityClickHandler}
        lat={city.lat}
        lng={city.lng}
        show={showCityNames && !isLoading}
      />
    ));
  }
  let selectedCityName;
  if (address) {
    selectedCityName = (
      <CityName
        id={address.geonameId}
        name={address.name}
        selected={true}
        onSelected={cityClickHandler}
        lat={address.lat}
        lng={address.lng}
        show={true}
      />
    );
  }

  return (
    <React.Fragment>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={4}
          onLoad={onLoad}
          onIdle={onMapIdle}
          options={options}
        >
          {markers}
          {cityNames}
          {selectedCityName}
        </GoogleMap>
      </LoadScript>
    </React.Fragment>
  );
});

export default MapComponent;
