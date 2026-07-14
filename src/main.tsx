import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import YinYangCoinGame from './components/YinYangCoinGame'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <YinYangCoinGame />
  </StrictMode>,
)
