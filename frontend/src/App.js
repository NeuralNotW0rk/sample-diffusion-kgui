
import React, { createContext, useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Drawer, AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { CreateNewFolder, FolderOpen, MenuOpen, Refresh, Save } from '@mui/icons-material';

//import './App.css';

import KnowledgeGraph from './graph_components/KnowledgeGraph';
import ViewDetails from './tool_components/ViewDetails';
import ImportModel from './tool_components/ImportModel';
import ExternalSource from './tool_components/ExternalSource';
import Generation from './tool_components/Generation';
import Variation from './tool_components/Variation';
import UpdateAttributes from './tool_components/UpdateAttributes';
import PlayAudio from './tool_components/PlayAudio';
import LoadProject from './tool_components/LoadProject';
import RescanSource from './tool_components/RescanSource';
import ExportSingle from './tool_components/ExportSingle';


const drawerWidth = 400;

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
  const [projectName, setProjectName] = useState(null);
  const [typeNames, setTypeNames] = useState(null);
  const [modelNames, setModelNames] = useState(null);
  const [tagList, setTagList] = useState(null);

  const [activeTool, setActiveTool] = useState('default')
  const [toolParams, setToolParams] = useState(null);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [pendingRefresh, setPendingRefresh] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<ThemeProvider theme={defaultTheme}>
    <ToolContext.Provider value={{
      typeNames,
      modelNames,
      projectName,
      tagList,
      toolParams,
      setTypeNames,
      setModelNames,
      setTagList,
      setToolParams,
      setActiveTool,
      setAwaitingResponse,
      setPendingRefresh,
      setProjectName,
    }}>
      <Box height='100vh' display='flex' flexDirection='col'>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MenuOpen />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => {
                handleClose();
                setPendingRefresh(true);
              }}>
                <ListItemIcon>
                  <Refresh fontSize="small" />
                </ListItemIcon>
                <ListItemText>Refresh graph</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                handleClose();
                setActiveTool('loadProject');
              }}>
                <ListItemIcon>
                  <FolderOpen fontSize="small" />
                </ListItemIcon>
                <ListItemText>Open</ListItemText>
              </MenuItem>
            </Menu>
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
          <Box sx={{ overflow: 'auto'}}>
            <Typography variant="h4" component="div" align='center'>
              {projectName ? (
                projectName
              ) : (
                "No project selected"
              )}
            </Typography>
            <Divider/>
            {awaitingResponse ? (
              <Typography variant="h6" noWrap component="div">
                Waiting for response...
              </Typography>
            ) : (
              <div>
                {activeTool === 'loadProject' && <LoadProject />}
                {activeTool === 'importModel' && <ImportModel />}
                {activeTool === 'externalSource' && <ExternalSource />}
                {activeTool === 'rescanSource' && <RescanSource />}
                {activeTool === 'generation' && <Generation />}
                {activeTool === 'variation' && <Variation />}
                {activeTool === 'details' && <ViewDetails />}
                {activeTool === 'updateAttributes' && <UpdateAttributes />}
                {activeTool === 'playAudio' && <PlayAudio />}
                {activeTool === 'exportSingle' && <ExportSingle />}
              </div>
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