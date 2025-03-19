import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Drawer, 
    AppBar, 
    Toolbar, 
    Typography, 
    Divider, 
    IconButton, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText,
    Switch
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Button from '@mui/material/Button';
import { blockchainClient } from '../blockchain/token';
import { AppContext } from '../context/appContext';

const drawerWidth = 240;

interface DrawerLayoutProps {
    children: React.ReactNode;
}

const DrawerLayout: React.FC<DrawerLayoutProps> = ({ children }) => {
    const appContext = React.useContext(AppContext);
    const [totalSupply, setTotalSupply] = useState("");
    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState<string | null>(null);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const connectWallet = async () => {
        console.log("Connecting wallet...");
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
            } catch (error) {
                console.error("User rejected the request.");
            }
        } else {
            console.error("MetaMask is not installed.");
        }
    };

    useEffect(()=>{
        blockchainClient.read.totalSupply().then((result) => {
            setTotalSupply((result as BigInt).toString());
        });
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={open?handleDrawerClose:handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        OpenOcean
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
        
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" noWrap component="div">
                            Total Supply of MRC Token: {totalSupply}
                        </Typography>

                        <Switch
                            checked={appContext.light}
                            onChange={() => appContext.setLight(!appContext.light)}
                            color="default"
                        />

                        {account ? (
                            <Typography variant="body1" noWrap component="div" sx={{ ml: 2 }}>
                                {account}
                            </Typography>
                        ) : (
                            <Button 
                                color="inherit" 
                                variant="outlined" 
                                size="small" 
                                startIcon={<AccountBalanceWalletIcon />}
                                sx={{ ml: 2 }}
                                onClick={connectWallet}
                            >
                                Connect Wallet
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
                variant="temporary"
                anchor="left"
                open={open}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
                </Box>
                <Divider />
                <List>
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <AccountBalanceWalletIcon />
                    </ListItemIcon>
                    <ListItemText primary="Wallet" />
                    </ListItemButton>
                </ListItem>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ 
                transition: (theme) => theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                })
                }}
            >
                <Toolbar /> {/* This creates space for the AppBar */}
                {children}
            </Box>
        </Box>
    );
};

export default DrawerLayout;