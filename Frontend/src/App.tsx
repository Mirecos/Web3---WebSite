import React, { useState, useEffect } from 'react';
import { isIdentified } from './api/user';
import Login from './forms/Login';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { Pages } from './types/Pages';
import { AppContext } from './context/appContext';
import DrawerLayout from './components/Sidebar';
import { NFTClient } from './blockchain/nft';

function getCurrentPage(page: Pages){
  let currentPage = <div>nothing</div>;
  switch(page){
    case Pages.Home:
      currentPage = <div>Home</div>;
      break;
    case Pages.none:
      currentPage = <div>None</div>;
      break;

  }
  return currentPage;
}

function App() {
  const [page, setPage] = useState(Pages.none);
  const [snackbar, setSnackbar] = useState({open: false, message: '', color: 'info' as 'info' | 'success' | 'error'});
  
  const showSnack = (message: string, color: 'info' | 'success' | 'error') => {
    setSnackbar({open: true, message: message, color: color});
  };
  
  let currentPage = getCurrentPage(page);
  const [identified, setIdentified] = useState(false);
  useEffect(() => {
    const checkIdentification = async () => {
      setIdentified(await isIdentified());
    };
    checkIdentification()
  }, [page]);

  NFTClient.read.totalSupply().then((result) => {
    console.log((result as BigInt).toString());
  });

  return (
    <AppContext.Provider value={{ setPage: setPage, showSnackbar: showSnack }}>
      <div className='flex flex-row w-full min-h-screen bg-[#FAFAFB]'>
        {
          identified ?
          (
            <DrawerLayout>
              {currentPage}
            </DrawerLayout>
          ) 
          :
          <div className='w-full h-full fixed z-50'>
            <Login />
          </div>
        }

        {/* Global snackbar */}
        <Snackbar
          anchorOrigin={ { vertical: 'bottom', horizontal: 'center' } }
          open={snackbar.open}
          onClose={()=>{setSnackbar({open: false, message: '', color: 'info'})}}
          key={'1'}
          autoHideDuration={4000}
        >
          <Alert severity={snackbar.color} >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </AppContext.Provider>
  );
}

export default App;
