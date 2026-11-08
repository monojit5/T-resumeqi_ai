
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Userprovider from './context/Userprovider.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Userprovider>
        <App />
        <Toaster
          position="bottom-right"
          reverseOrder={true}
        />
      </Userprovider>
    </BrowserRouter>
  </StrictMode>
);
