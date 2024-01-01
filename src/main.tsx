import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from '../src-v3/components/app'
import '../src-v3/index.css'
import '../src-v3/util.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
