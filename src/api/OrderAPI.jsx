import { SERVER_ADDR } from "../configs/config";
import { OrderStatus } from "../configs/global";
import { validRefreshToken } from "./AuthAPI";

export const getAllOrders = async (type) => {
    
    switch(type){
        case('pending'): 
            type = OrderStatus.PENDING;
            break;
        case('processing'):
            type = OrderStatus.PROCESSING;
            break;
        case('completed'):
            type = OrderStatus.COMPLETED;
            break;
        case('canceled'):
            type = OrderStatus.CANCELED;
            break;
        default:
            type = OrderStatus.ALL;
    }

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
    const response = await fetch(`${SERVER_ADDR}/order/get-all?type=${type}`, options);
    
    const data = await response.json();
    console.log(data)

    return {data: data, status: response.status, ok: response.ok};

}

export const getOrderDetail = async (id) => {
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
    const response = await fetch(`${SERVER_ADDR}/order/detail/${id}`, options);
    
    const data = await response.json();
    console.log(data)

    return {data: data, status: response.status, ok: response.ok};

}

export const updateOrder = async (id, body) => {
    const validRefToken = await validRefreshToken();
    if(!validRefToken) return false;

    const token = localStorage.getItem('accessToken');
    
    const query = `?id=${id}`

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify(body)
    };
    const response = await fetch(`${SERVER_ADDR}/order/update${query}`, options);
    
    const data = await response.json();
    console.log(data)

    return {data: data, status: response.status, ok: response.ok};

}