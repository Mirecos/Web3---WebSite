import { Card, CardActionArea, CardContent, CardMedia, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NFTAdress, NFTClient, NFTMinecraftAdress, NFTMinecraftClient } from "../blockchain/nft";
import axios from "axios";
import { marketplaceClient } from "../blockchain/marketplace";
import { AppContext } from "../context/appContext";

interface NFTCardProps {
    id: number,
    collection: number
}

export default function NFTCard(NFTCardProps: NFTCardProps) {
    const appContext = React.useContext(AppContext);

    const [res, setRes] = useState<NFT | null>(null);
    useEffect(() => {
        let client;
        if(NFTCardProps.collection === 0){
            client = NFTClient
        }
        else if(NFTCardProps.collection === 1){
            client = NFTMinecraftClient
        }

        if(client){
            client.read.tokenURI([NFTCardProps.id]).then((result) => {
                if(result){
                    axios.get(result as string).then((res)=>{
                        setRes(res.data as NFT)
                    }).catch((err)=>{
                        console.log(err)
                    })
                }
            })
        }

    }
    , [NFTCardProps.id])

    return (
        <Card sx={{ 
            width: 400, 
            boxShadow: 3, 
            transition: 'transform 0.2s', 
            '&:hover': { transform: 'scale(1.05)' }, 
            border: '1px solid text.secondary'
        }}>
            <CardActionArea sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', height: 200 }}>
                <CardContent sx={{ 
                    padding: 2, 
                    flex: '1 0 180px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                }}>
                    <Typography gutterBottom variant="h6" component="div">
                        {res?.name || `NFT ${NFTCardProps.id}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {res?.description || 'No description'}
                    </Typography>
                </CardContent>
                
                {
                    res ?
                    <CardMedia
                        component="img"
                        src={res.image}
                        alt={`NFT ${NFTCardProps.id}`}
                        sx={{ width: 220, height: 200, objectFit: 'cover' }}
                    /> :
                    <Skeleton variant="rectangular" width={220} height={200} />
                }
            </CardActionArea>
        </Card>
    );
}