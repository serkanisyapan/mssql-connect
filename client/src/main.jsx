import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NewTable from './NewTable.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NewTable/>
  </StrictMode>,
)
