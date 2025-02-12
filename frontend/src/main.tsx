import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import './index.css'
import {BrowserRouter} from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import {RecoilRoot} from 'recoil';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <RecoilRoot><App /></RecoilRoot>
  </StyledEngineProvider>
  </BrowserRouter>
)
