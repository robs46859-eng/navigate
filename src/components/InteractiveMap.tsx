import React, { useCallback, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, OverlayView } from '@react-google-maps/api';
import { Place } from '../types';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 39.7392,
  lng: -104.9903
};

interface InteractiveMapProps {
  places: Place[];
  onMarkerClick: (place: Place) => void;
  userLocation?: { lat: number; lng: number };
  directionsResponse?: google.maps.DirectionsResult | null;
  navigationActive?: boolean;
  onMapLoad?: (map: google.maps.Map) => void;
  destination?: Place | null;
  selectedPlace?: Place | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  places, 
  onMarkerClick, 
  userLocation,
  directionsResponse,
  navigationActive,
  onMapLoad,
  destination,
  selectedPlace
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
    if (onMapLoad) onMapLoad(map);
  }, [onMapLoad]);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (typeof google === 'undefined') return (
    <div className="w-full h-full bg-[#5D4037]/5 rounded-[32px] flex items-center justify-center">
      <p className="text-[#5D4037]/40 font-medium animate-pulse">Loading Map...</p>
    </div>
  );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation || center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: true,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{ "weight": "2.00" }]
          },
          {
            "featureType": "all",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#9c9c9c" }]
          },
          {
            "featureType": "all",
            "elementType": "labels.text",
            "stylers": [{ "visibility": "on" }]
          },
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{ "color": "#f2f2f2" }]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#ffffff" }]
          },
          {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#ffffff" }]
          },
          {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#eeeeee" }]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#7b7b7b" }]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#ffffff" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{ "visibility": "simplified" }]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#c8d7d4" }]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#070707" }]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#ffffff" }]
          }
        ]
      }}
    >
      {!navigationActive && places.map(place => (
        <Marker
          key={place.id}
          position={{ lat: place.lat, lng: place.lng }}
          onClick={() => onMarkerClick(place)}
          zIndex={selectedPlace?.id === place.id ? 1000 : 1}
          icon={{
            url: `https://maps.google.com/mapfiles/ms/icons/${
              selectedPlace?.id === place.id ? 'green' :
              place.category === 'hospital' ? 'red' : 
              place.category === 'nursing_room' ? 'pink' : 
              place.category === 'bathroom' ? 'blue' : 'orange'
            }-dot.png`,
            scaledSize: selectedPlace?.id === place.id ? new google.maps.Size(40, 40) : undefined
          }}
        />
      ))}

      {userLocation && (
        <OverlayView
          position={userLocation}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <div className="pulse-dot" />
          </div>
        </OverlayView>
      )}

      {navigationActive && destination && (
        <Marker
          position={{ lat: destination.lat, lng: destination.lng }}
          icon={{
            url: `https://maps.google.com/mapfiles/ms/icons/${
              destination.category === 'hospital' ? 'red' : 
              destination.category === 'nursing_room' ? 'pink' : 
              destination.category === 'bathroom' ? 'blue' : 'orange'
            }-dot.png`
          }}
        />
      )}

      {directionsResponse && (
        <DirectionsRenderer
          options={{
            directions: directionsResponse,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#E97451',
              strokeWeight: 6,
              strokeOpacity: 0.8
            }
          }}
        />
      )}
    </GoogleMap>
  );
};
