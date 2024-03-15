import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Axios from '../../API/AxiosApi';
import Cookies from 'js-cookie';
import { logout, deleteUserInfo } from '../../Redux/Action';

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        Axios.post(`http://localhost:8080/logout`, {
        }, {
            headers: {
                //withCredentials: true, // 쿠키를 포함시켜 요청
                //'RefreshToken': refresh,
                "Content-Type": "application/json",
            },
        }).then(response => {
            if (response.status === 204) {
                console.log('로그아웃 성공');
                Axios.defaults.headers.common.Authorization = undefined;
                //Cookies.remove('accessToken'); 서버에서 하면 이렇게 할 필요x
                //Cookies.remove('refreshToken');
                dispatch(logout());
                dispatch(deleteUserInfo());
                navigate('/');
                localStorage.removeItem('userToken');
            } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");
                //alert("ID, Password가 비어있습니다.");
                //return "fail";
            }
        }).catch(error => {
            //console.log({error});
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    };

    return (
        <div >
            <button type='button' onClick={handleLogout}>로그아웃</button>
        </div>
    )
}

export default Logout
