import React from 'react';
import { Outlet, Link } from "react-router-dom";
// import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  // function App() {
  render() {
    return (

      <main className="App">

        <div style={{ padding: "1rem" }}>

          <h1>xcp.dev</h1>
          <h3>Counterparty Bitcoin block explorer</h3>

          <nav
            style={{
              borderBottom: "solid 1px",
              paddingBottom: "1rem",
            }}
          >

            <Link to="/">Home</Link> |{" "}
            <Link to="/asset">Assets</Link> |{" "}
            <Link to="/address">Addresses</Link> |{" "}
            <Link to="/block">Blocks</Link>

          </nav>
          <Outlet />
        </div>

      </main>

    );

    // return (
    //   <div className="App">
    //     <header className="App-header">
    //       <img src={logo} className="App-logo" alt="logo" />
    //       <p>
    //         Edit <code>src/App.js</code> and save to reload.
    //       </p>
    //       <a
    //         className="App-link"
    //         href="https://reactjs.org"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Learn React
    //       </a>
    //     </header>
    //   </div>
    // );
  }

}

export default App;
