import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/AuthAPI';
import Cookies from 'js-cookie';

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken){
        navigate('/');
        window.scrollTo(0, 0);
      } 
    }, []);

    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(){
        const res = await login({account, password});

        if (res.status == 401)
            alert('Sai tài khoản hoặc mật khẩu!')
        else if(!res.ok)
            alert('Lỗi đăng nhập, hãy thử lại!')
        else {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('firstname', res.data.user.firstname ? res.data.user.firstname : '');
            Cookies.set('refreshToken', res.data.refreshToken, { expires: 30}); 
            navigate('/');
        }
    }

    return(
        <div className='login' style={{display: 'flex', justifyContent: 'center', padding: '64px'}}>
            <Form style={{width: '400px'}}>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Tài khoản</Form.Label>
                    <Form.Control type="text" placeholder="Nhập tài khoản" 
                        value={account} onChange={(e) => setAccount(e.target.value)}
                    />
                </Form.Group>
        
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control type="password" placeholder="Nhập mật khẩu" 
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleLogin}>
                    Đăng nhập
                </Button>
            </Form>
        </div>
        
    )
}

export default Login