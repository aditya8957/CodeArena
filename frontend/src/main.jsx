// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from "react-router";
// import {store} from "./store/store.js"
// import { Provider } from 'react-redux';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Provider store={store}>
//     <BrowserRouter>
//     <App />
//     </BrowserRouter>
//     </Provider>
//   </StrictMode>,
// )




import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from "react-router";
import { store } from "./store/store.js";
import { Provider } from 'react-redux';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

