import React, { useMemo } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ContextProvider } from './utils/Context';
import './App.css';
import Header from './layout/Header';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  return (
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
      </ThemeProvider>
    </ContextProvider>
  );
}

export default App;
