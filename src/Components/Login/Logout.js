import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Axios from '../../API/AxiosApi';
import Cookies from 'js-cookie';
//import { logout, deleteUserInfo } from '../../Redux/Action';
import { login, logout, resetUser } from '../../Redux/Store'; // store 파일 경로
import { MdLogout } from "react-icons/md";

import './Logout.css'

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {

        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem("accessToken");
        if (refreshToken !== undefined && accessToken !== undefined) {
            Axios.defaults.headers.common.Authorization = undefined;
            dispatch(logout());
            dispatch(resetUser());
            navigate('/');
            localStorage.clear();
        }

        Axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        Axios.post(`${ip}/logout`, {
            refreshToken
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => {
            if (response.status === 200) {
                console.log('로그아웃 성공');
            } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
                console.log("403");
            }
        }).catch(error => {
            if (error.response.status === 403) {
                alert(`${error.response.data.message}`);
            }
        });
    };

    return (
        <div >
            <button className='logout-button'  onClick={handleLogout}>로그아웃</button>
        </div>
    )
}

export default Logout
