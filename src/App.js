import './App.css';

import React from 'react';
import { Outlet } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <main className="App">
        <Outlet />
      </main>
    );
  }
}

export default App;
