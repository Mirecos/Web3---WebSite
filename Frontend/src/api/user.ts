import axios from "axios";
import { API_URL_USER_ISIDENTIFIED, API_URL_USER_LOGIN } from "./Routes";

export async function isIdentified() {
    try {
        const res = await axios.get(API_URL_USER_ISIDENTIFIED, { withCredentials: true })
        if(res.status === 200){
            console.info("User is identified")
            return true
        }else{
            console.info("User is not identified")
            return false
        }
    } catch (error) {
        console.error(error)
        return false
    }
}

export async function login(email: string, password: string) {
    const res = await axios.post(API_URL_USER_LOGIN, {
        user: {
            email: email,
            password: password
        }
    },
    { withCredentials: true }
    )
    return res.data as ApiResponse<null>;
}

