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

  const { data, destination, onSelectedDestination, showMarkers, showCityNames, isLoading } = props;

  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const [forceUpdate, setForceUpdate] = useState(false);
  const [citiesInView, setCitiesInView] = useState([]);
  const cityCache = useRef({});
  const mapRef = useRef(null);
  //const prevDataRef = useRef(null);
  const mapIdleTimerRef = useRef(null);

  

  // useEffect(() => {
  //   console.log(destination)
  // }, [destination]);

  useEffect(() => {
    console.log(citiesInView)
  }, [citiesInView])


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
      console.error(error);
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

  }, [data, onSelectedDestination]);

  const markerClickHandler = useCallback((id) => {
    onSelectedMarkerHandler(id);
  }, [onSelectedMarkerHandler]);

  const onSelectedCityHandler = useCallback((id) => {
    const city = citiesInView.find(city => {
      return city.geonameId === id;
    });

    props.clickedCity(city);

    if (city && map) {

      map.panTo({ lat: city.lat, lng: city.lng });

      if (map.getZoom() < 12) {
        map.setZoom(12);
      }
    }

  }, [citiesInView]);

  const cityClickHandler = useCallback((id) => {
    onSelectedCityHandler(id);
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

    if (destination && map && !isLoading) {
      map.panTo(destination.geometry);
      if (map.getZoom() < 13) {
        map.setZoom(13);
      }

    }
}, [destination, map, isLoading]);

  const { address } = props;
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

    useEffect(() => {
      if (address && map) {
        //Recenter map
        setMapCenter({ lat: address.lat, lng: address.lng});
        if (map.getZoom() < 12) {
          map.setZoom(12);
        }
      }
    }, [address, map, forceUpdate]);


  //Pan & zoom to first destination when data is fetched
  // useEffect(() => {

  //   console.log(isLoading)
  //   console.log("HERE")
  //   //prevDataRef.current = data;
  //   // if (data && data.length > 0 && mapRef.current && JSON.stringify(data) !== JSON.stringify(prevDataRef.current)) {
  //   if (data && data.length > 0 && map && !isLoading) {
  //     console.log("HERE")
  //     map.panTo(data[0].geometry);
  //     map.setZoom(14);
  //   }
  // }, [data, isLoading]);

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
      />
    );
  }

  return (
    <React.Fragment>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          // center={address || citiesInView.length !== 0 ? null : (map && map.getCenter().lat !== 0 && map.getCenter().lng !== 0) ? map.getCenter() : { lat: 0, lng: 0 }}
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
