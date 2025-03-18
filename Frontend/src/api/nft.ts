import axios from "axios"
import { API_URL_NFT_GETNFTIMAGE } from "./Routes"

export async function getNftImageUrl(id: number) {
    try {
        const res = await axios.get(API_URL_NFT_GETNFTIMAGE+id, { withCredentials: true })
        return res.data as ApiResponse<{url: string, name: string, description: string}>;
    } catch (error) {
        console.error(error)
        return false
    }
}