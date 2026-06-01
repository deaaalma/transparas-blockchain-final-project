import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Providers } from './app/providers'
import App from './app/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Providers>
      <App />
    </Providers>
  </BrowserRouter>
)
