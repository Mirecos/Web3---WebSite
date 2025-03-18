import { createPublicClient, getContract, http } from 'viem';
import { polygonAmoy } from 'viem/chains';

const client = createPublicClient({
    chain: polygonAmoy,
    transport: http(),
});

const contractABI = [
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
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
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

const contractAddress = '0xcdFF2A5AE2DaDCADc7Ae5DA0ACb6d8352ACd9056';
export const blockchainClient = getContract({ address: contractAddress, abi: contractABI, client: client })

