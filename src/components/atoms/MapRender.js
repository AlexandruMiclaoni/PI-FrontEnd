import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapRender.css';

const MapRender = ({ events, center }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFyaXVzYWxiYSIsImEiOiJjbHBxNnVrbjYxNXd1MnJsZTh3ZXVkdDFpIn0._o92jCkoQrJDvOA8qvKo7g';

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/dariusalba/clpq783c5013x01o98rs180lc',
        center: [21, 44],
        zoom: 30,
      });

      map.current.on('load', function () {
        map.current.resize();
      });
    }

    const handleScroll = () => {
      const mapDiv = mapContainer.current;
      const rect = mapDiv.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop <= 355) {
        mapDiv.classList.remove('fixed-map');
      } else if (rect.top <= 200) {
        mapDiv.classList.add('fixed-map');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (map.current && events.length > 0) {
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers.length > 0) {
        markers[0].remove();
      }

      const bounds = new mapboxgl.LngLatBounds();

      events.forEach((event) => {
        const { coordinates } = event.location;
        const [lng, lat] = coordinates;

        bounds.extend([lat, lng]);

        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.backgroundColor = 'black';
        markerElement.style.color = 'white';
        markerElement.style.width = 'fit-content';
        markerElement.style.paddingRight = '20px';
        markerElement.style.paddingLeft = '20px';
        markerElement.style.height = '40px';
        markerElement.style.borderRadius = '50px';
        markerElement.style.display = 'flex';
        markerElement.style.justifyContent = 'center';
        markerElement.style.alignItems = 'center';
        markerElement.innerText = event.name;

        new mapboxgl.Marker({ element: markerElement })
          .setLngLat([lat, lng])
          .addTo(map.current);
      });

      if (events.length > 0) {
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      } else {
        map.current.setCenter(center);
        map.current.setZoom(15);
      }
    }
  }, [events, center]);

  return <div ref={mapContainer} className="map" style={{ height: '550px', width: '700px' }} />;
};

export default MapRender;
