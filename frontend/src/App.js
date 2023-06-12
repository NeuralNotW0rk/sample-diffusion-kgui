import { ThemeProvider, createTheme } from '@mui/material';
import './App.css';

import KnowledgeGraph from './graph_components/KnowledgeGraph';

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButtonBase: {
      defaultProps: {
        size: 'small',
      }
    }
  },
});

function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="app-container">
        <header className='header'>
          <h1> Dance Diffusion KGUI </h1>
        </header> 
        <KnowledgeGraph />
      </div>
    </ThemeProvider>
  );
}

export default App;
