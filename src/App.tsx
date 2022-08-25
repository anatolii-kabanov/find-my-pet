import './App.css';
import React from 'react';
import mapboxgl from 'mapbox-gl';
 
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const App: React.FC = () =>  {
  return (
    <div className="app">
      Find my pet
    </div>
  );
}

export default App;
