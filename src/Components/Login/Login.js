import React, { useState } from 'react'
import Axios from '../../API/AxiosApi';
import Cookies from 'js-cookie';

// login 함수 정의
// login -> Login으로 변경(컴포넌트는 대문자로 시작해야 react-router-dom 사용가능)
const Login = async (email, password) => {
    const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
    //const ip = `http://localhost:8877`;
    //console.log('로그인 진행', email, password, ip);
    return await Axios.post(`${ip}/login`, {
        Id: email,
        Password: password,
    }, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            
        }
    }).then(response => {
        if (response.status === 200) {
            Axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
            //console.log(response);
            //sessionStorage.setItem('accessToken', response.data.accessToken);
            //sessionStorage.setItem('refreshToken', response.data.refreshToken);
            //localStorage.setItem('userInfo', JSON.stringify({ mail:response.user.id })); //한개 정도는 가지고 있어야 새로고침시에 사용가능
            return {
                status: "success",
                data: response.data
              };
        } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
            alert("ID, Password가 비어있습니다.");
            return "fail";
        }
    }).catch(error => {
        if (error.response.status === 403) {
            alert(`${error.response.data.message}`);
        }
        return "fail";
    });
};

export default Login