
import React, { createContext, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Drawer, AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Divider, Autocomplete, TextField} from '@mui/material';
import { FolderOpen, MenuOpen, Refresh, Save } from '@mui/icons-material';

//import './App.css';

import KnowledgeGraph from './graph-components/KnowledgeGraph';
import ViewDetails from './tool-components/ViewDetails';
import ImportModel from './tool-components/ImportModel';
import ExternalSource from './tool-components/ExternalSource';
import Generation from './tool-components/Generation';
import Variation from './tool-components/Variation';
import UpdateAttributes from './tool-components/UpdateAttributes';
import LoadProject from './tool-components/LoadProject';
import RescanSource from './tool-components/RescanSource';
import ExportSingle from './tool-components/ExportSingle';
import BatchUpdateAttributes from './tool-components/BatchUpdateAttributes';
import SearchAndFilter from './tool-components/SearchAndFilter';


const drawerWidth = 400;

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
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
  const [nodeNames, setNodeNames] = useState(null);
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
      nodeNames,
      projectName,
      tagList,
      toolParams,
      setTypeNames,
      setNodeNames,
      setTagList,
      setToolParams,
      setActiveTool,
      setAwaitingResponse,
      setPendingRefresh,
      setProjectName,
    }}>
      <Box height='100vh' display='flex' flexDirection='col'>
        <CssBaseline />
        <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MenuOpen />
            </IconButton>
            <Menu
              id='basic-menu'
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
                  <Refresh fontSize='small' />
                </ListItemIcon>
                <ListItemText>Refresh graph</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                handleClose();
                setActiveTool('loadProject');
              }}>
                <ListItemIcon>
                  <FolderOpen fontSize='small' />
                </ListItemIcon>
                <ListItemText>Open</ListItemText>
              </MenuItem>
            </Menu>
            <Typography variant='h6' noWrap component='div'>
              Dance Diffusion KGUI
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant='permanent'
          anchor='left'
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <Typography variant='h6' component='div' align='center'>
              {projectName ? (
                'Project: ' + projectName
              ) : (
                'No project selected'
              )}
            </Typography>
            <Divider />
            {false ? (
              <Typography variant='h6' noWrap component='div'>
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
                {activeTool === 'batchUpdateAttributes' && <BatchUpdateAttributes />}
                {activeTool === 'exportSingle' && <ExportSingle />}
              </div>
            )}
          </Box>
        </Drawer>
        <Box flex='1' overflow='hidden' >
          <Toolbar />
          <KnowledgeGraph pendingRefresh={pendingRefresh} />
        </Box>
        {/*
        <Drawer
          variant='permanent'
          anchor='right'
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <SearchAndFilter />
          </Box>
        </Drawer>
        */}
      </Box>
    </ToolContext.Provider>
  </ThemeProvider>
  );
}

export default App;
export { ToolContext };