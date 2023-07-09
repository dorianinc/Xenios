// import dotenv from "dotenv";
import { useEffect, useMemo } from "react";
import { useMap } from "../../context/MapContext";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "./Map.css";

const Map = ({ spotLat, spotLng }) => {

  const { currentZoom, setCurrentZoom, currentLat, setCurrentLat, currentLng, setCurrentLng } =
    useMap();
    
  const center = useMemo(() => ({ lat: currentLat, lng: currentLng }), [currentLat, currentLng]);
  const mapOptions = {
    zoom: currentZoom,
    center,
  };

  useEffect(() => {
    setCurrentZoom(19);
    setCurrentLat(spotLat);
    setCurrentLng(spotLng);
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });
  if (!isLoaded) return <h1>Loading...</h1>;
  return (
    <>
      <GoogleMap options={mapOptions} mapContainerClassName="map-container">
      <Marker position={{ lat: spotLat, lng: spotLng }} />
      </GoogleMap>
    </>
  );
};

export default Map;
