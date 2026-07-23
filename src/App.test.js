import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';

// Mock react-router-dom so Jest doesn't try to resolve it from exports
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <div>{element}</div>,
}));

test('renders AppLogo', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
  const logoElements = screen.getAllByText(/AppLogo/i);
  expect(logoElements.length).toBeGreaterThan(0);
});


