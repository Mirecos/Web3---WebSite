import { createPublicClient, getContract, http } from 'viem';
import { polygonAmoy } from 'viem/chains';

const client = createPublicClient({
    chain: polygonAmoy,
    transport: http(),
});

const NFTcontractABI = [
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllTokens",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const NFTAdress = '0xfc4dc60C3d1682e258050D747DE7A7f11789829e'

export const NFTClient = getContract({ address: NFTAdress, abi: NFTcontractABI, client: client })
