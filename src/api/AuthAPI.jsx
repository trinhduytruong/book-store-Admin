import { SERVER_ADDR } from "../configs/config";
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';

export const login = async (account) => {

    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: account.account,
          password: account.password
        })
      }

      const response = await fetch(`${SERVER_ADDR}/user/login`, options);
      
      const data = await response.json();
      console.log(data)

      return {data: data, status: response.status, ok: response.ok};
} 

export const logout = async () => {
    const validRefToken = await validRefreshToken();
    if(!validRefToken) return false;

    const token = localStorage.getItem('accessToken');
    const options = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
    };
    const response = await fetch(`${SERVER_ADDR}/user/logout`, options);
    const data = await response.json();
    console.log(data);

    return {data: data, status: response.status, ok: response.ok};
} 

export const validRefreshToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const decodedToken = jwt_decode(accessToken);

    if(Date.now() >= decodedToken.exp * 1000){
        const refreshToken = Cookies.get('refreshToken');
        console.log(refreshToken)
        
        const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshToken}`
            }
        }
        const response = await fetch(`${SERVER_ADDR}/refresh-token`, options);
        
        const res = await response.json();

        if(!response.ok){
            alert('Bạn cần đăng nhập lại!')
            localStorage.removeItem('accessToken');
            localStorage.removeItem('firstname');
            Cookies.remove('refreshToken');
            return false;
        }
        localStorage.setItem('acceToken', res.data.accessToken);
        Cookies.set('refreshToken', res.data.refreshToken, { expires: 30}); 
    }
    else console.log('valid token')

    return true;
}



