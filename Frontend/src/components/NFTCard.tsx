import { Card, CardActionArea, CardContent, CardMedia, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NFTClient, NFTMinecraftClient } from "../blockchain/nft";
import axios from "axios";

interface NFTCardProps {
    id: number,
    collection: number
}

export default function NFTCard(NFTCardProps: NFTCardProps) {

    const [res, setRes] = useState<NFT | null>(null);
    useEffect(() => {
        let client
        if(NFTCardProps.collection === 0)client = NFTClient
        else if(NFTCardProps.collection === 1)client = NFTMinecraftClient

        client.read.tokenURI([NFTCardProps.id]).then((result) => {
            if(result){
                axios.get(result as string).then((res)=>{
                    setRes(res.data as NFT)
                    console.log((res.data as NFT).image)
                }).catch((err)=>{
                    console.log(err)
                })

            }
        })

    }
    , [NFTCardProps.id])

    return (
        <Card sx={{ width: 200, boxShadow: 3, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' }, border: '1px solid text.secondary' }}>
            <CardActionArea>
                {
                    res?
                    <CardMedia
                        component="img"
                        src={res.image}
                        alt={`NFT ${NFTCardProps.id}`}
                        sx={{ height: 200 }}
                    />:
                    <Skeleton variant="rectangular" width={200} height={140} />

                }
                
                <CardContent sx={{ padding: 2 }}>
                    <Typography gutterBottom variant="h6" component="div">
                        {res?.name || `NFT ${NFTCardProps.id}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {res?.description || 'No description'}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}