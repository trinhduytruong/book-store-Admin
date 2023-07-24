import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/AuthAPI';

function NavBar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setIsLoggedIn(true)
        else setIsLoggedIn(false)
    });

    async function handleLogOut() {

        const res = await logout();
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('firstname');
        Cookies.remove('refreshToken');

        if(res === false || res.status == 403){
            navigate('/login');
            window.scrollTo(0, 0);
        }
        else if(res.status == 401){
            alert('Bạn không có quyền truy cập!');
            navigate('/login');
            window.scrollTo(0, 0);
        }
        if(res.ok){
            navigate('/');
            alert('Đăng xuất thành công!');
        }
        
    }

    return (
        <Navbar bg="dark" variant="dark" fixed="top" >
            <Container>
            <Navbar.Brand href="/">Brightbook</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href={isLoggedIn ? '/title/all' : '/login'}>Quản lý sách</Nav.Link>
                <Nav.Link href={isLoggedIn ? '/order/all' : '/login'}>Quản lý đơn hàng</Nav.Link>
                <Nav.Link href="/login" hidden={isLoggedIn}>Đăng nhập</Nav.Link>
                <Nav.Link onClick={handleLogOut} hidden={!isLoggedIn}>Đăng xuất</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;