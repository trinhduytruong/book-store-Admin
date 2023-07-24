import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { getOrderDetail, updateOrder } from '../../api/OrderAPI';
import moment from 'moment-timezone';
import { getDistrictName, getProvinceName, getWardName } from '../../configs/VietnameseAddresses';
import { BookStatus, OrderStatus } from '../../configs/global';
import './orderPopup.css'
import { updateBook } from '../../api/BookAPI';
import { updateTitleSold } from '../../api/TitleAPI';

function OrderPopup(props) {
    const navigate = useNavigate();
    const [order, setOrder] = useState({
        createdAt: '', finalPrice: 0, items: [], notes: '', recipientInfo: [], shippingCost: 0, status: 0, totalPrice: 0, userID: ''
    });
    const [bookIDList, setBookIDList] = useState([]);

    async function fetchProfileData() {
            
        const res = await getOrderDetail(props.orderID);

        if(res === false){
            navigate('/login');
            window.scrollTo(0, 0);
        }
        else if (!res.ok)
            alert('Gửi yêu cầu thất bại, hãy thử lại!')
        else {
            const tmpOrder = res.data.order;
            tmpOrder.createdAt = moment(tmpOrder.createdAt).tz('Asia/Ho_Chi_Minh').format('YYYY/MM/DD - HH:mm');
     
            if(!tmpOrder.notes) tmpOrder.notes = '[Không có]' 

            const tmpAddr = tmpOrder.recipientInfo;
            if(tmpAddr.length != 0){
                tmpAddr[4] = getWardName(tmpAddr[2], tmpAddr[3], tmpAddr[4]);
                tmpAddr[3] = getDistrictName(tmpAddr[2], tmpAddr[3]);
                tmpAddr[2] = getProvinceName(tmpAddr[2]);
                tmpOrder.recipientInfo = tmpAddr;
            }

            setBookIDList(res.data.bookIDList);
            setOrder(tmpOrder);
        }
    }

    useEffect(() => {

        fetchProfileData();
          
    }, [props.orderID]);

    function renderStatus(){
        switch(order.status){
            case(OrderStatus.PENDING):
                return 'Chờ xác nhận';
            case(OrderStatus.PROCESSING):
                return 'Đang xử lý';
            case(OrderStatus.COMPLETED):
                return 'Hoàn tất';
            case(OrderStatus.CANCELED):
                return 'Bị hủy';
            default:
                return 'Loading...';
        }
    }

    function onBookSelectChange(e, i, j){
        const tmpOrder = order;
        tmpOrder.items[i].bookIDs[j] = e.target.value;
        setOrder(tmpOrder);
    }

    async function handleConfirm(){
        const res = await updateOrder(props.orderID, {items: order.items, status: OrderStatus.PROCESSING});
        if(res === false){
            navigate('/login');
            window.scrollTo(0, 0);
        }
        else if (!res.ok)
            alert('Gửi yêu cầu thất bại, hãy thử lại!')
        else {
            fetchProfileData();
            props.onRefresh();
            props.onHide();
            const items = order.items;
            for(let i in items){
                for(let j in items[i].bookIDs){
                    const res = await updateBook(items[i].bookIDs[j], {status: BookStatus.PENDING});
                
                    if(res === false){
                        navigate('/login');
                        window.scrollTo(0, 0);
                    }
                    else if (!res.ok)
                        alert('Gửi yêu cầu thất bại, hãy thử lại!')
                    else console.log('updated book successfully!');
                }
            }
        }

    }

    async function handleCancel(){
        const res = await updateOrder(props.orderID, {status: OrderStatus.CANCELED});
        if(res === false){
            navigate('/login');
            window.scrollTo(0, 0);
        }
        else if (!res.ok)
            alert('Gửi yêu cầu thất bại, hãy thử lại!')
        else {
            fetchProfileData();
            props.onRefresh();
            props.onHide();
        }
    }

    async function handleComplete(){
        const res = await updateOrder(props.orderID, {status: OrderStatus.COMPLETED});
        if(res === false){
            navigate('/login');
            window.scrollTo(0, 0);
        }
        else if (!res.ok)
            alert('Gửi yêu cầu thất bại, hãy thử lại!')
        else {
            fetchProfileData();
            props.onRefresh();
            props.onHide();
            const items = order.items;
            for(let i in items){
                for(let j in items[i].bookIDs){
                    const res = await updateBook(items[i].bookIDs[j], {status: BookStatus.SOLD});
                
                    if(res === false){
                        navigate('/login');
                        window.scrollTo(0, 0);
                    }
                    else if (!res.ok)
                        alert('Gửi yêu cầu thất bại, hãy thử lại!')
                    else console.log('updated book successfully!');
                }
                
                const res = await updateTitleSold(items[i].titleID, {sold: items[i].count});
                if(res === false){
                    navigate('/login');
                    window.scrollTo(0, 0);
                }
                else if (!res.ok)
                    alert('Gửi yêu cầu thất bại, hãy thử lại!')
                else console.log('updated title successfully!');
            }
        }
    }

    return (
        <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            {`Đơn hàng #${props.orderID}`}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='order-info-block-1'>
                <div className='order-info-block-1a'>
                    <h5>Chi tiết đơn hàng</h5>
                    <div className='order-info'>
                        <p className='order-info-label'>Tình trạng: 
                            <span className={'order-info-status ' + `n${order.status}`}>
                                {renderStatus()}
                            </span>
                        </p>
                        <p className='order-info-label'>ID tài khoản:<span>{order.userID}</span></p>
                        <p className='order-info-label'>Ngày mua:<span>{order.createdAt}</span></p>
                        <p className='order-info-label'>Tổng tiền:<span>{new Intl.NumberFormat("de-DE").format(order.finalPrice)} đ</span></p>
                    </div>
                </div>
                <div className='order-info-block-1b'>
                    <h5>Thông tin người nhận</h5>
                    <div className='order-info'>
                        <p className='order-info-label'>Tên người nhận:<span>{order.recipientInfo[0]}</span></p>
                        <p className='order-info-label'>Địa chỉ:<span>{`${order.recipientInfo[5]}, ${order.recipientInfo[4]}, ${order.recipientInfo[3]}, ${order.recipientInfo[2]}`}</span></p>
                        <p className='order-info-label'>Điện thoại:<span>{order.recipientInfo[1]}</span></p>
                        <p className='order-info-label'>Ghi chú:<span style={{fontWeight: 400}}>{order.notes}</span></p>
                    </div>
                </div>
            </div>
            <div className='order-info-block-2'>
                <h5>Danh sách sản phẩm</h5>

                <div className="title-list-wrap">
                    <div className='title-list-header'>
                        <div className='title-list-header-image'>
                            <span>Hình ảnh</span>
                        </div>
                        <div className='title-list-header-name'>
                            <span>Sản phẩm</span>
                        </div>
                        <div className='title-list-header-sku'>
                            <span>SKU</span>
                        </div>
                        <div className='title-list-header-unitprice'>
                            <span>Đơn giá</span>
                        </div>
                        <div className='title-list-header-count'>
                            <span>SL</span>
                        </div>
                        <div className='title-list-header-totalprice'>
                            <span>Số tiền</span>
                        </div>
                    </div>
                    <div style={{display:(order.items?.length == 0 ? 'flex' : 'none'),
                        padding: '8px', color: '#7a7e7f', justifyContent:'center'}}
                    >
                        Bạn chưa có sản phẩm nào.
                    </div>
                    <div className='title-list-items'>
                    {
                        order.items?.map((item, i)=>{
                            const [name, price, count] = [item.name, item.price, item.count];
                            const trimmedName = name?.length > 36 ? name.split(0, 36)+'...' : name;
                            return(
                                <div className='title-list-items-wrap' key={i}>
                                    <div className='title-list-item-image'>
                                        <img src={item.image} alt={trimmedName}/>
                                    </div>
                                    <div className='title-list-item-name'>
                                        <span>{trimmedName}</span>
                                    </div>
                                    <div className='title-list-item-sku'>
                                        {
                                            order.status === OrderStatus.PENDING
                                            ? (
                                                Array(item.count).fill(0).map((_, j) => {
                                                    return(
                                                    <select key={j} onChange={(e) => onBookSelectChange(e, i, j)}>
                                                        <option value="select-placeholder" hidden>Chọn mã SKU sản phẩm</option>
                                                        {
                                                        bookIDList[item.titleID]?.map((e, k) => {
                                                                return <option key={k} >{e}</option>
                                                            })
                                                        }
                                                    </select>
                                                    )
                                                })
                                            )
                                            : (
                                              item.bookIDs?.map((e, i) => {
                                                return  <><span key={i}>{e}</span><br/></>
                                              })  
                                            )
                                        }
                                    
                                    </div>
                                    <div className='title-list-item-unitprice'>
                                        <span>{new Intl.NumberFormat("de-DE").format(price)} đ</span>
                                    </div>
                                    <div className='title-list-item-count'>
                                        <span>{count}</span>
                                    </div>
                                    <div className='title-list-item-totalprice'>
                                        <span>{new Intl.NumberFormat("de-DE").format(price * count)} đ</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </div> 
                    <div className='order-price-info'>
                        <div className='order-total-price'>
                            <div>Thành tiền:</div>
                            <div className='price' style={{fontWeight: '600'}}>
                            {new Intl.NumberFormat("de-DE").format(order.totalPrice)} đ
                            </div>
                        </div>
                        <div className='order-shipping-price'>
                            <div>Phí vận chuyển:</div>
                            <div className='price' style={{fontWeight: '600'}}>
                            {new Intl.NumberFormat("de-DE").format(order.shippingCost)} đ
                            </div>
                        </div>
                        <div className='order-final-price' style={{fontWeight: '600', fontSize: '18px'}}>
                            <div >Tổng số tiền:</div>
                            <div className='price' style={{fontWeight: '700', color: '#c93333'}}>
                            {new Intl.NumberFormat("de-DE").format(order.finalPrice)} đ
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide} variant="outline-secondary">Trở lại</Button>
            <Button onClick={handleCancel} variant="outline-danger" hidden={order.status != 0}>Hủy đơn hàng</Button>
            <Button onClick={handleConfirm} variant="primary" hidden={order.status != 0}>Xác nhận đơn hàng</Button>
            <Button onClick={handleComplete} variant="success" hidden={order.status != 1}>Hoàn tất đơn hàng</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default OrderPopup;