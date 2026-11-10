
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './pages/Subscription.css';
import App from './App.jsx';
import Userprovider from './context/Userprovider.jsx';
import ResumeProvider from './context/ResumeProvider.jsx';
import SubscriptionProvider from './context/SubscriptionProvider.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Userprovider>
        <SubscriptionProvider>
          <ResumeProvider>
            <App />
          </ResumeProvider>
        </SubscriptionProvider>
        <Toaster
          position="bottom-right"
          reverseOrder={true}
        />
      </Userprovider>
    </BrowserRouter>
  </StrictMode>
);
