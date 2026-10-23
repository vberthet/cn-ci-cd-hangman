import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { loadConfig } from './config'
import { initSentry } from './sentry'
import './styles.css'

async function start() {
  const config = await loadConfig()
  initSentry(config)

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

start()
