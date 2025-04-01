import { Box, Button, Dialog, DialogContent, DialogTitle, List, ListItem, Paper, Skeleton, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { NFTClient, NFTMinecraftClient } from '../blockchain/nft';
import NFTCard from '../components/NFTCard';
import axios from 'axios';
import { marketplaceClient } from '../blockchain/marketplace';
import { AppContext } from '../context/appContext';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { blockchainClient } from '../blockchain/token';


function HomePage() {
    const appContext = React.useContext(AppContext);
    
    const [open, setOpen] = React.useState(false);

    const [firstCollection, setFirstCollection] = useState([] as string[]);
    const [secondCollection, setSecondCollection] = useState([] as string[]);

    const [selectedNFT, setSelectedNFT] = useState(null as NFT | null);
    const [selectedNFTid, setSelectedNFTid] = useState(null as number | null);
    const [selectedCollection, setSelectedCollection] = useState(null as number | null);
    
    // [address seller, address highestBidder, uint256 highestBid, uint256 endTime, bool ended]
    const [selectedAuctionNFT, setSelectedAuctionNFT] = useState(null as any[] | null);
    const [selectedAuctionNFTOwner, setSelectedAuctionNFTOwner] = useState(null as string | null);

    const [currentBid, setCurrentBid] = useState(0);

    const handleClickOpen = async (collection: number, index: number) => {
        setSelectedCollection(collection)
        setSelectedNFTid(index)
        setOpen(true);
        let client, NFTid;
        let result = {};
        if(collection === 0){
            client = NFTClient
            NFTid = firstCollection[index]
        }else if(collection === 1){
            client = NFTMinecraftClient
            NFTid = secondCollection[index]
        }

        if(client && NFTid){
            client.read.tokenURI([NFTid]).then((result) => {
                if(result){
                    axios.get(result as string).then((res)=>{
                        setSelectedNFT(res.data as NFT)
                    }).catch((err)=>{
                        console.log(err)
                    })
                }
            })

            marketplaceClient.read.getAuctionInfo([client.address, BigInt(NFTid)]).then((result)=> {
                if(result){
                    setSelectedAuctionNFT(result as Array<any>)
                }
                console.log("Auction infos")
                console.log(result)
            })
            client.read.ownerOf([BigInt(NFTid)]).then((result) => {
                setSelectedAuctionNFTOwner(result as string)
            })
        }
    };
    
    const handleClose = () => {
        setSelectedAuctionNFT(null)
        setSelectedNFT(null)
        setOpen(false);
    };
    
    const startAuction = () => {
        if(selectedNFTid != null && selectedCollection != null){
            console.log("Starting auction")
            let contractAddress = "";
            if(selectedCollection === 0)contractAddress = NFTClient.address
            else if(selectedCollection === 1)contractAddress = NFTMinecraftClient.address

            const walletClient = createWalletClient({
                chain: polygonAmoy,
                transport: custom(window.ethereum), 
            });

            walletClient.writeContract({
                address: contractAddress as `0x${string}`,
                functionName: 'approve',
                abi: [{
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "approve",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }],
                args: [marketplaceClient.address, BigInt(selectedNFTid)],
                account: appContext.connectedAddress as `0x${string}` | null
            }).then((result) => {
                walletClient.writeContract({
                    address: marketplaceClient.address,
                    functionName: 'startAuction',
                    abi: [{
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "nftContract",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "duration",
                                "type": "uint256"
                            }
                        ],
                        "name": "startAuction",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }],
                    args: [contractAddress as `0x${string}`, BigInt(selectedNFTid), BigInt(5000)],
                    account: appContext.connectedAddress as `0x${string}` | null
                })
            })

            handleClose()
            handleClickOpen(selectedCollection, selectedNFTid)
        }
    }

    const placeBid = () => {
        if(selectedNFTid != null){
            const walletClient = createWalletClient({
                chain: polygonAmoy,
                transport: custom(window.ethereum), 
            });

            const pub = createPublicClient({
                chain: polygonAmoy,
                transport: custom(window.ethereum), 
            });
    
            let contractAddress = "";
            if(selectedCollection === 0)contractAddress = NFTClient.address
            else if(selectedCollection === 1)contractAddress = NFTMinecraftClient.address


            walletClient.writeContract({
                address: blockchainClient.address as `0x${string}`,
                functionName: 'approve',
                abi: [{
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "approve",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }],
                args: [marketplaceClient.address, BigInt(currentBid)],
                account: appContext.connectedAddress as `0x${string}` | null
            }).then((result) => {
                walletClient.writeContract({
                    address: marketplaceClient.address as `0x${string}`,
                    functionName: 'placeBid',
                    abi: [{
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "nftContract",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "bidAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "placeBid",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }],
                    args: [contractAddress as `0x${string}`, BigInt(selectedNFTid), BigInt(currentBid)],
                    account: appContext.connectedAddress as `0x${string}` | null
                })
            })
            
        }
    }

    useEffect(() => {
        const fetchfirstCollection = async () => {
            NFTClient.read.getAllTokens().then((result) => {
                setFirstCollection((result as BigInt).toString().split(','));
            });
        }
        const fetchSecondCollection = async () => {
            NFTMinecraftClient.read.getAllTokens().then((result) => {
                setSecondCollection((result as BigInt).toString().split(','));
            });
        }
        fetchfirstCollection()
        fetchSecondCollection()
    }, []);

    return (
        <Box>
            <h1 className='ml-6 my-4 text-3xl font-bold'>Paintings Collection</h1>
            <List style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll', width: '100vw', scrollbarWidth: 'thin', scrollbarColor: 'white transparent' }}>
                    {
                        firstCollection.length === 0 ?
                            [1, 2, 3, 4, 5].map((index) => {
                                return <Skeleton key={index} className='m-2' variant="rectangular" width={400} height={300} />
                            })
                            :
                            firstCollection.map((nft, index) => {
                                return (
                                    <ListItem key={index} className='m-2' onClick={()=>(handleClickOpen(0, index))}>
                                        <NFTCard id={parseInt(nft)} collection={0} />
                                    </ListItem>
                                )
                            })
                    }
            </List>



            <h1 className='ml-6 my-4 text-3xl font-bold'>Minecraft collection</h1>
            <List style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll', width: '100vw', scrollbarWidth: 'thin', scrollbarColor: 'white transparent' }}>
                    {
                        secondCollection.length === 0 ?
                            [1, 2, 3, 4, 5].map((index) => {
                                return <Skeleton key={index} className='m-2' variant="rectangular" width={400} height={300} />
                            })
                            :
                            secondCollection.map((nft, index) => {
                                return (
                                    <ListItem key={index} className='m-2' onClick={()=>(handleClickOpen(1, index))}>
                                        <NFTCard id={parseInt(nft)} collection={1} />
                                    </ListItem>
                                )
                            })
                    }
            </List>



            <Dialog
                fullWidth={true}
                maxWidth='lg'
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {
                        selectedNFT?
                        selectedNFT.name
                        :
                        <Skeleton className='m-2' variant="rectangular" width={200} height={30} />
                    }
                </DialogTitle>
                <DialogContent >
                    <div className='mb-8'>
                        {
                            selectedNFT?
                            (appContext.connectedAddress != null && selectedAuctionNFTOwner?.toLowerCase() === appContext.connectedAddress?.toLowerCase())?
                            'Propriétaire : Vous':
                            'Propriétaire : ' + selectedAuctionNFTOwner
                            
                            :
                            <Skeleton className='m-2' variant="rectangular" width={200} height={30} />
                        }
                    </div>
                    <div className='flex justify-between'>
                        <div className='w-[800px]'>
                            {
                                selectedNFT?
                                <div>
                                    {selectedNFT.description}
                                    <div className='mt-20'>
                                        { 
                                            selectedAuctionNFT?.length ?
                                                appContext.connectedAddress ?
                                                ((appContext.connectedAddress != null && selectedAuctionNFTOwner?.toLowerCase() === appContext.connectedAddress?.toLowerCase())?
                                                    <div>
                                                        <Button 
                                                        sx={{color: "white", backgroundColor: "gray"}}
                                                        onClick={startAuction}
                                                        >Mise en enchère</Button>
                                                    </div>
                                                    :
                                                    (selectedAuctionNFT[0].toLowerCase() === appContext.connectedAddress?.toLowerCase())?
                                                        <div className='flex flex-col'>
                                                            <div className='font-bold'>
                                                                Vous avez lancez l'enchère
                                                            </div>
                                                            Enchère en cours
                                                            <div>
                                                                Seller : Vous
                                                            </div>
                                                            <div>
                                                                Enchère actuelle : {Number(selectedAuctionNFT[2]) ?Number(selectedAuctionNFT[2]) :"0"} MRC
                                                            </div>
                                                            <div>
                                                                Adresse : {selectedAuctionNFT[1] === "0x0000000000000000000000000000000000000000"?"Pas d'enchère":selectedAuctionNFT[1]}
                                                            </div>
                                                            <div>
                                                                Date de fin : {selectedAuctionNFT[3]?new Date(Number(selectedAuctionNFT[3]) * 1000).toLocaleString():""}
                                                            </div>
                                                            <TextField
                                                                style={{marginTop: 16}}
                                                                id="outlined-number"
                                                                label="Number"
                                                                type="number"
                                                                slotProps={{
                                                                    inputLabel: {
                                                                    shrink: true,
                                                                    },
                                                                }}
                                                                onChange={(value)=>{setCurrentBid(Number(value.target.value))}}
                                                                    />
                                                                <Button
                                                                style={{marginTop: 16}}
                                                                sx={{color: "white", backgroundColor: "gray"}}
                                                                onClick={placeBid}
                                                                >Enchérir</Button>
                                                        </div>
                                                    :
                                                        <div>
                                                            {selectedAuctionNFT[3] ? 
                                                            <div className='flex flex-col'>
                                                                Enchère en cours
                                                                <div>
                                                                    Seller : {selectedAuctionNFT[0]?selectedAuctionNFT[0]:"0"}
                                                                </div>
                                                                <div>
                                                                    Enchère actuelle : {Number(selectedAuctionNFT[2]) ?Number(selectedAuctionNFT[2]) :"0"} MRC
                                                                </div>
                                                                <div>
                                                                    Adresse : {selectedAuctionNFT[1] === "0x0000000000000000000000000000000000000000"?"Pas d'enchère":selectedAuctionNFT[1]}
                                                                </div>
                                                                <div>
                                                                    Date de fin : {selectedAuctionNFT[3]?new Date(Number(selectedAuctionNFT[3]) * 1000).toLocaleString():""}
                                                                </div>
                                                                <TextField
                                                                    style={{marginTop: 16}}
                                                                    id="outlined-number"
                                                                    label="Number"
                                                                    type="number"
                                                                    slotProps={{
                                                                        inputLabel: {
                                                                        shrink: true,
                                                                        },
                                                                    }}
                                                                    onChange={(value)=>{setCurrentBid(Number(value.target.value))}}
                                                                    />
                                                                <Button
                                                                style={{marginTop: 16}}
                                                                sx={{color: "white", backgroundColor: "gray"}}
                                                                onClick={placeBid}
                                                                >Enchérir</Button>
                                                            </div>
                                                            : 
                                                            <div>
                                                                Pas d'enchère en cours
                                                            </div>}
                                                        </div>
                                                    )
                                                :
                                                "Connectez-vous pour enchérir."
                                            :
                                            <Skeleton className='m-2' variant="rectangular" width={800} />
                                        }
                                    </div>
                                </div>
                                :
                                <Skeleton className='m-2' variant="rectangular" width={800} height={200} />
                            }
                        </div>
                        <div>
                            {
                                selectedNFT?
                                <img
                                    src={selectedNFT.image}
                                    alt={`NFT ${selectedNFT.name}`}
                                />:
                                <Skeleton variant="rectangular" width={200} height={140} />
                            }
                        </div>
                    </div>
                    
                    
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default HomePage;
