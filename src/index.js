import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './routes/home';
import Transaction from './routes/transaction';
// import BlockHome from './routes/block_home';
import Block from './routes/block';
import Address from './routes/address';
import Asset from './routes/asset';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="tx/:txHash" element={<Transaction />} />
          {/* <Route path="blocks" element={<BlockHome />} /> */}
          <Route path="block/:block" element={<Block />} />
          <Route path="address/:address" element={<Address />} />
          <Route path="asset/:assetName" element={<Asset />} /> {/* for now only the asset_name, not the asset_longname */}
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>How you got here!?</p>
                {/* <p>There's nothing here!</p> */}
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
