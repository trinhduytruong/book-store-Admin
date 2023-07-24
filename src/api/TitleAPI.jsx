import { SERVER_ADDR } from "../configs/config";
import { validRefreshToken } from "./AuthAPI";

export const updateTitleSold = async (titleID, body) => {

    const validRefToken = await validRefreshToken();
    if(!validRefToken) return false;

    const token = localStorage.getItem('accessToken');
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify(body)
    };

    const query = `?id=${titleID}`
    const response = await fetch(`${SERVER_ADDR}/title/update-sold${query}`, options);
    
    const data = await response.json();
    console.log(data)

    return {data: data, status: response.status, ok: response.ok};

}