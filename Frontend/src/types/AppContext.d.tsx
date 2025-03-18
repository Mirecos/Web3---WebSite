import { Pages } from "./Pages";

declare type AppContextType = {
    setPage : (p : Pages) => void,
    showSnackbar : (message : string, type: 'info' | 'success' | 'error') => void
};
export default AppContextType