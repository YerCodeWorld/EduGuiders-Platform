import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Import global styles
import '../src/styles/global.css'

// Now the imports are working. Added vite-env.d.ts
// import '../../eduguiders/src/styles/global.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)