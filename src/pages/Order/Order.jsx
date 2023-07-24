import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllOrders } from '../../api/OrderAPI';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { OrderStatus } from '../../configs/global';
import moment from 'moment-timezone';
import { getDistrictName, getProvinceName, getWardName } from '../../configs/VietnameseAddresses';
import OrderPopup from '../../components/Popup/OrderPopup';

function Order() {
    const navigate = useNavigate();
    const { type } = useParams();
    const [orders, setOrders] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState('');

    async function fetchOrdersData(){
        const res = await getAllOrders(type);

        if(res === false){
            navigate('/login');
            window.scrollTo(0, 0);
        }
        else if(!res.ok)
            alert('Đã xảy ra lỗi, hãy thử lại!');
        else{

            res.data?.map((e, i) => {
                if(e.recipientInfo?.length != 0){
                    e.recipientInfo[4] = getWardName(e.recipientInfo[2], e.recipientInfo[3], e.recipientInfo[4]);
                    e.recipientInfo[3] = getDistrictName(e.recipientInfo[2], e.recipientInfo[3]);
                    e.recipientInfo[2] = getProvinceName(e.recipientInfo[2]);
                    res.data[i] = e;
                }
            })
            setOrders(res.data)
        }
    }

    useEffect(() => {
        fetchOrdersData();
    }, [type]);

    function selectOrdersType(type){
        navigate('/order/'+type); 
    }

    function convertStatus(value){
        switch(value){
            case(OrderStatus.PENDING):
              return 'Chờ xác nhận';
            case(OrderStatus.PROCESSING):
              return 'Đang xử lý';
            case(OrderStatus.COMPLETED):
              return 'Hoàn tất';
            case(OrderStatus.CANCELED):
              return 'Bị hủy';
          }
    }

    async function onRefresh(){
        setModalShow(false);
        await fetchOrdersData()
    }

    return(
        <div className="order-management" 
            style={{display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    padding: '0 64px'}}>
            <OrderPopup
                show={modalShow}
                onHide={() => setModalShow(false)}
                orderID={selectedOrder}
                onRefresh={onRefresh}
            />    
            <h4 style={{margin: '16px 0 8px 0'}}>QUẢN LÝ ĐƠN HÀNG</h4>
            <ButtonGroup style={{margin: '0 0 16px 0'}}>
                <Button variant={type === 'all' ? 'secondary' : 'outline-secondary'}
                    onClick={() => selectOrdersType('all')}
                >
                    Tất cả
                </Button>
                <Button variant={type === 'pending' ? 'secondary' : 'outline-secondary'}
                    onClick={() => selectOrdersType('pending')}
                >
                    Chờ xác nhận
                </Button>
                <Button variant={type === 'processing' ? 'secondary' : 'outline-secondary'}
                    onClick={() => selectOrdersType('processing')}
                >
                    Đang xử lý
                </Button>
                <Button variant={type === 'completed' ? 'secondary' : 'outline-secondary'}
                    onClick={() => selectOrdersType('completed')}
                >
                    Đã hoàn tất
                </Button>
                <Button variant={type === 'canceled' ? 'secondary' : 'outline-secondary'}
                    onClick={() => selectOrdersType('canceled')}
                >
                    Bị hủy
                </Button>
            </ButtonGroup>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Mã đơn hàng</th>
                        <th>Ngày mua</th>
                        <th>Người nhận</th>
                        <th>Địa chỉ</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.map((e, i) => {
                           return(
                            <tr key={i} style={{cursor: 'pointer'}}  
                                onClick={() => {
                                    setModalShow(true);
                                    setSelectedOrder(e._id);
                                }}
                            >
                                <td>{i+1}</td>
                                <td>{e._id}</td>
                                <td>{moment(e.createdAt).tz('Asia/Ho_Chi_Minh').format('YYYY/MM/DD - HH:mm')}</td>
                                <td>{e.recipientInfo[0]}</td>
                                <td>{`${e.recipientInfo[5]}, ${e.recipientInfo[4]}, ${e.recipientInfo[3]}, ${e.recipientInfo[2]}`}</td>
                                <td>{`${new Intl.NumberFormat("de-DE").format(e.finalPrice)} đ`}</td>
                                <td>{convertStatus(e.status)}</td>
                            </tr>
                           ) 
                        })
                    }
                </tbody>
            </Table>
            <div style={{display:(orders?.length === 0 ? 'flex' : 'none'), justifyContent: 'center'}}>
                Không có đơn hàng nào phù hợp.
            </div>
        </div>
    )
}

export default Order