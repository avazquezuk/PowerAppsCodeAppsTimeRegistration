import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import PowerProvider from './PowerProvider.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { ThemedApp } from './components/ThemedApp';
import './index.css'

// Create a client for TanStack Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PowerProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </PowerProvider>
  </StrictMode>,
)
