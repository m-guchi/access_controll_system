import { customAxios } from '../templete/Axios';

export const Logout = () => {
    customAxios.get("/logout")
    .then(res => {
        if(res.status===204){
            window.location.reload();
        }
    })
}