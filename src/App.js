import React from 'react';
import { Outlet, Link } from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
import {Divider} from "@tremor/react";

class App extends React.Component {
  // function App() {
  render() {
    return (

      <main className="App">

        <div style={{ padding: "1rem" }}>

          <div className={"mb-6"}><span className={"text-yellow-500 text-4xl font-extrabold"}>xcp</span><span className={"text-xl font-bold"}>.dev</span></div>
          <h3 className={"text-xl font-bold my-3"}>Counterparty Bitcoin Tools</h3>
          {/* <h3>Counterparty Bitcoin data explorer</h3> */}
          {/* <h3>Counterparty Bitcoin explorer</h3> */}
          {/* <h3>Counterparty Bitcoin block explorer</h3> */}
          <nav className={"mt-12"}>
            <Link to="/" className={"text-yellow-600 text-xl font-bold hover:text-yellow-700"}>Data</Link> |{" "}
            <Link to="/wallet" className={"text-yellow-600 text-xl font-bold hover:text-yellow-700"}>Wallet</Link>
            {/* <Link to="/">Home</Link> */}
            {/* <Link to="/">Mempool</Link> |{" "}
            <Link to="/blocks">Blocks</Link> */}
          </nav>
          <Divider/>
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
