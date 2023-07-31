import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Marker from './Marker';
import CONSTANTS from '../../../../constants';
import CityName from './CityName';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapComponent = React.forwardRef((props, ref) => {

  const [map, setMap] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [citiesInView, setCitiesInView] = useState([]);
  // const [clickedMarker, setClickedMarker] = useState(false);
  // const [clickedCity, setClickedCity] = useState(false);
  const cityCache = useRef({});
  const mapRef = useRef(null);
  const prevDataRef = useRef();

  
  const fetchCitiesInView = async () => {

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
  };

  const onMapIdle = useCallback(() => {
    
    if (!mapRef.current) {
      return;
    }

    if (mapRef.current.getZoom() >= 12) {
      fetchCitiesInView();
    } else {
      // const city = citiesInView ? citiesInView.find(city => {
      //   return city.geonameId === address.geonameId;
      // }) : null;
      if (citiesInView && citiesInView.length > 0) {
        setCitiesInView([]);
      }
    }
  }, [citiesInView]);

  useEffect(() => {
    console.log(citiesInView)
  }, [citiesInView])

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const { data, destination, onSelectedDestination } = props;

  const onSelectedMarkerHandler = useCallback((id) => {
    const destination = data.find(destination => {
      return destination.name === id;
    });

    onSelectedDestination(destination);

    if (destination && mapRef.current) {
      mapRef.current.panTo(destination.geometry);

      if (mapRef.current.getZoom() < 15) {
        mapRef.current.setZoom(15);
      }
    }

  }, [data, onSelectedDestination]);

  const markerClickHandler = useCallback((id) => {

    onSelectedMarkerHandler(id);

  }, [onSelectedMarkerHandler]);

  const onSelectedCityHandler = useCallback((id) => {
    const city = citiesInView.find(city => {
      return city.geonameId === id;
    });

    props.clickedCity(city);

    // if (destination && mapRef.current) {
    //   mapRef.current.panTo(destination.geometry);

    //   if (mapRef.current.getZoom() < 14) {
    //     mapRef.current.setZoom(14);
    //   }
    // }

  }, [citiesInView]);

  const cityClickHandler = useCallback((id) => {

    onSelectedCityHandler(id);

    // onSelectedHandler(id);

  }, [onSelectedCityHandler]);

  // const fetchCityName = async (lat, lng) => {

  //   try {
  //     const response = await fetch(CONSTANTS.apiURL + `/geonames/nearest-city?lat=${lat}&lng=${lng}`);
  //     const cityName = await response.json();

  //     return cityName;

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const clickCityHandler = async (event) => {

  //   if (clickedMarker) {
  //     setClickedMarker(false);
  //     return;
  //   }

  //   const clickedCity = await fetchCityName(event.latLng.lat(), event.latLng.lng());

  //   if (!Array.isArray(clickedCity)) {
  //     props.clickedCity(clickedCity);
  //   } else {
  //     console.log("No city corresponding to these coordinates");
  //   }
    
  //   setClickedMarker(false);
  // };

  const forceMapUpdate = () => {
    setForceUpdate(!forceUpdate);
  };

  useImperativeHandle(ref, () => ({
    forceMapUpdate,
  }));

  //Center on selected destination
  useEffect(() => {

    if (destination && mapRef.current) {
        mapRef.current.panTo(destination.geometry);
        if (mapRef.current.getZoom() < 15) {
            mapRef.current.setZoom(15);
        }
    }

}, [destination]);

  const { address } = props;
  useEffect(() => {
    // const fetchLocation = async () => {
    //   try {
        
    //     const response = await fetch(
    //       CONSTANTS.apiURL + `/googleMaps/location-by-address?address=${address.name}`
    //     );
    //     const data = await response.json();
    //     console.log(data);
    //     if (map) {
    //       map.setCenter(data);
    //       if (mapRef.current.getZoom() < 12) {
    //         mapRef.current.setZoom(12);
    //       }
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    if (address && map) {
      // fetchLocation();

      map.setCenter({ lat: address.lat, lng: address.lng })
      if (mapRef.current.getZoom() < 14) {
        mapRef.current.setZoom(14);
      }
    }
  }, [address, map, forceUpdate]);


  //Pan & zoom to first destination when data is fetched
  useEffect(() => {

    prevDataRef.current = data;
    if (data && data.length > 0 && mapRef.current && JSON.stringify(data) !== JSON.stringify(prevDataRef.current)) {
        
        mapRef.current.panTo(data[0].geometry);
        mapRef.current.setZoom(14);
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

  //console.log(JSON.stringify(data) === JSON.stringify(prevDataRef.current))
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
      />
    );
  }

  return (
    <React.Fragment>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={props.address || citiesInView.length !== 0 ? null : (map && map.getCenter().lat !== 0 && map.getCenter().lng !== 0) ? map.getCenter() : { lat: 0, lng: 0 }}
          zoom={4}
          onLoad={onLoad}
          onIdle={onMapIdle}
          options={options}
          // onClick={clickCityHandler}
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
