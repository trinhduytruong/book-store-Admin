import { SERVER_ADDR } from "../configs/config";
import { BookStatus } from "../configs/global";
import { validRefreshToken } from "./AuthAPI";

// export const getAllBooks = async (titleID, status = BookStatus.ALL) => {

//     const validRefToken = await validRefreshToken();
//     if(!validRefToken) return false;

//     const token = localStorage.getItem('accessToken');
    
//     const options = {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     };

//     const query = `?status=${status}`
//     const response = await fetch(`${SERVER_ADDR}/book/get-all/${titleID}${query}`, options);
    
//     const data = await response.json();
//     console.log(data)

//     return {data: data, status: response.status, ok: response.ok};

// }

export const updateBook = async (bookID, body) => {

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

    const query = `?id=${bookID}`
    const response = await fetch(`${SERVER_ADDR}/book/update${query}`, options);
    
    const data = await response.json();
    console.log(data)

    return {data: data, status: response.status, ok: response.ok};

}