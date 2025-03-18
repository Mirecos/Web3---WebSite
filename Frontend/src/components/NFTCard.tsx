import { Card, CardActionArea, CardContent, CardMedia, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getNftImageUrl } from "../api/nft";

interface NFTCardProps {
    id: number
}

export default function NFTCard(NFTCardProps: NFTCardProps) {

    const [res, setRes] = useState<{url: string, name: string, description: string} | null>(null);
    useEffect(() => {
        getNftImageUrl(NFTCardProps.id).then((res)=>{
            if(res && res.data?.url){
                setRes(res.data)
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
                        src={res?.url}
                        alt={`NFT ${NFTCardProps.id}`}
                        sx={{ height: 140 }}
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