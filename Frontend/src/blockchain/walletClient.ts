import { createWalletClient, custom } from "viem";
import { polygonAmoy } from 'viem/chains';
const walletClient = createWalletClient({
    chain: polygonAmoy,
    transport: custom(window.ethereum)
});