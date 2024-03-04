import React, { useState } from 'react'
import axios from 'axios';

// login 함수 정의
// login -> Login으로 변경(컴포넌트는 대문자로 시작해야 react-router-dom 사용가능)
const Login = (email, password) => {
    return axios.post(`http://localhost:8080/login`, {
        email: email,
        password: password,
    }, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then(response => {
        console.log({ response });
        if (response.code === 200) {
            console.log(response.data); // 서버로부터의 응답 처리
            return "success";
        } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
            console.log("403");
            alert("ID, Password가 비어있습니다.");
            return "fail";
        }
    }).catch(error => {
        //console.log({error});
        if (error.response.status === 403) {
            alert(`${error.response.data.message}`);
        }
    });
};

export default Login