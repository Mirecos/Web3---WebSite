import { Pages } from "./Pages";

declare type AppContextType = {
    setPage : (p : Pages) => void,
    showSnackbar : (message : string, type: 'info' | 'success' | 'error') => void,
    setLight : (light: boolean) => void,
    light : boolean
};
export default AppContextType