
import React, { createContext, useState } from 'react';
import { ThemeProvider, createTheme, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//import './App.css';

import KnowledgeGraph from './graph_components/KnowledgeGraph';
import ToolBox from './tool_components/ToolBox';


const drawerWidth = 300;

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

const ToolContext = createContext();

function App() {
  const [typeNames, setTypeNames] = useState(null);
  const [modelNames, setModelNames] = useState(null);
  const [tagList, setTagList] = useState(null);

  const [activeTool, setActiveTool] = useState('default')
  const [toolParams, setToolParams] = useState(null);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [pendingRefresh, setPendingRefresh] = useState(true);

  return (<ThemeProvider theme={defaultTheme}>
    <ToolContext.Provider value={{
      typeNames,
      modelNames,
      tagList,
      toolParams,
      setTypeNames,
      setModelNames,
      setTagList,
      setToolParams,
      setActiveTool,
      setAwaitingResponse,
      setPendingRefresh
    }}>
      <Box height='100vh' display='flex' flexDirection='col'>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Dance Diffusion KGUI
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', p: 2}}>
            {awaitingResponse ? (
              <Typography variant="h6" noWrap component="div">
                Waiting for response...
              </Typography>
            ) : (
              <ToolBox activeTool={activeTool} />
            )}
          </Box>
        </Drawer>
        <Box height='90%' flex='1'>
          <Toolbar />
          <KnowledgeGraph pendingRefresh={pendingRefresh} />
        </Box>
      </Box>
    </ToolContext.Provider>
  </ThemeProvider>
  );
}

export default App;
export { ToolContext };