import React from 'react';
import ReactDOM from 'react-dom/client';
import './output.css';
// import './index.css';
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
import Assetspage from './routes/assets_page';
import Transactionspage from './routes/transactions_page';
import Messagespage from './routes/messages_page';
import Blockspage from './routes/blocks_page';
import Apidoc from './routes/apidoc';
import Wallet from './routes/wallet';

import { OneElements } from './routes/shared/elements';

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
          <Route path="assets" element={<Assetspage />} />          
          <Route path="transactions" element={<Transactionspage />} />
          
          <Route path="messages/:table" element={<Messagespage />} />
          <Route path="messages" element={<Messagespage />} />
          
          <Route path="blocks" element={<Blockspage />} />
          <Route path="api" element={<Apidoc />} />
          <Route path="wallet/:address" element={<Wallet />} />
          <Route path="wallet" element={<Wallet />} />
          {/* <Route path="wallet/:address" element={<Wallet />} /> */}
          <Route
            path="*"
            element={
              <OneElements route_element={
                <div class="py-2 my-2">
                  <p class="dark:text-slate-100">
                    There is a problem with the url...
                  </p>
                </div>
              } />
              // <main style={{ padding: "1rem" }}>
              //   <p>There is a problem with the entered url...</p>
              // </main>
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
