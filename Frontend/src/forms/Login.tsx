import { Box, FormControl, TextField } from '@mui/material';
import { Button } from '@mui/base';
import React, { useContext, useState } from 'react';
import { isIdentified, login } from '../api/user';
import { AppContext } from '../context/appContext';
import { AxiosError } from 'axios';
import { Pages } from '../types/Pages';

interface LoginProps {

}
export function Login(LoginProps: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const appContext = useContext(AppContext);

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} className='h-full'>
            <FormControl className='flex align-middle self-center justify-center flex-col gap-8'>
                <h1 className='font-bold text-3xl'>Connexion à mon appli cool sur la blockchain</h1>

                <TextField
                    label="Email"
                    onChange={(e)=>{setEmail(e.target.value)}}
                    />

                <TextField
                    label="Mot de passe"
                    type="password"
                    onChange={(e)=>{setPassword(e.target.value)}}
                    />
                <Button 
                    className='bg-black text-white py-2 px-8 rounded-lg font-bold'
                    onClick={async ()=>{
                        try {
                            const res = await login(email, password);
                            appContext.showSnackbar(res.message, 'success');
                            appContext.setPage(Pages.Home);
                        } catch (error: any) {
                            if( error instanceof AxiosError){
                                console.log(error.response?.data.message);
                                appContext.showSnackbar(error.response?.data.message, 'error');
                            }
                        }
                    }}
                >
                    Se connecter
                </Button>

            </FormControl>
        </Box>
    );
}

export default Login;