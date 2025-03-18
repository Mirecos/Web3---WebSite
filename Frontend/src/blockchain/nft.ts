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
    }
];
const NFTAdress = '0x5A20ad789a300D03A083b633914C46eaB43b15e6'

export const NFTClient = getContract({ address: NFTAdress, abi: NFTcontractABI, client: client })
