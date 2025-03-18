import { Box, List, ListItem, Paper, Skeleton, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { NFTClient } from '../blockchain/nft';
import NFTCard from '../components/NFTCard';


function HomePage() {
    const [nftList, setNftList] = useState([] as string[]);

    useEffect(() => {
        const fetchNFTList = async () => {
            NFTClient.read.getAllTokens().then((result) => {
                setNftList((result as BigInt).toString().split(','));
            });
        }
        fetchNFTList()
    }, []);

    return (
        <Box>
            {/* <h1 className='ml-6 my-4 text-3xl font-bold'>How it works ?</h1>
            <Paper className='m-6 p-6' elevation={3} sx={{borderRadius: '10px', textAlign: 'center' }}>
                <Typography variant="h3" className='font-bold' gutterBottom>
                    Welcome to OpenOcean
                </Typography>
                <Typography variant="body1" className='mt-2' paragraph>
                    OpenOcean is a revolutionary web3 NFT browser that allows you to explore, trade, and manage your NFTs seamlessly. Our platform aggregates liquidity from multiple exchanges to provide you with the best prices and a wide range of services including trading, lending, and staking.
                </Typography>
                <Typography variant="h5" className='mt-4 font-bold' gutterBottom>
                    Introducing MIRECOS (MRC)
                </Typography>
                <Typography variant="body1" className='mt-2' paragraph>
                    MIRECOS (MRC) is the native cryptocurrency token used on OpenOcean to buy and sell NFTs. With MRC, you can easily purchase your favorite digital assets and participate in the growing NFT ecosystem.
                </Typography>
            </Paper> */}
            <h1 className='ml-6 my-4 text-3xl font-bold'>NFT Collection</h1>
            <List style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll', width: '100vw', scrollbarWidth: 'thin', scrollbarColor: 'white transparent' }}>
                    {
                        nftList.length === 0 ?
                            [1, 2, 3, 4, 5].map((index) => {
                                return <Skeleton key={index} className='m-2' variant="rectangular" width={400} height={300} />
                            })
                            :
                            nftList.map((nft, index) => {
                                return (
                                    <ListItem key={index} className='m-2'>
                                        <NFTCard id={parseInt(nft)} />
                                    </ListItem>
                                )
                            })
                    }
                    <ListItem key={242} className='m-2'>
                        <NFTCard id={242} />
                    </ListItem>
                    <ListItem key={333} className='m-2'>
                        <NFTCard id={333} />
                    </ListItem>
                    <ListItem key={242} className='m-2'>
                        <NFTCard id={242} />
                    </ListItem>
                    <ListItem key={333} className='m-2'>
                        <NFTCard id={333} />
                    </ListItem>
            </List>
        </Box>
    );
}

export default HomePage;
