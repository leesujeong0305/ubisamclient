import React from 'react'
import Axios from '../API/AxiosApi'

function UserInfo(){

    const token = localStorage.getItem('userToken');
    const emailToken = localStorage.getItem('userEmailToken');
    return Axios.get(`http://localhost:8080/getUserInfo?userEmail=${encodeURIComponent(emailToken)}&name=${encodeURIComponent(token)}`, { //get은 body없음
        headers: {
            "Content-Type": "application/json",
        }
    }).then((res) => {
        if (res.data.userData) {
            return res.data.userData;
        } else if (res.data.code === 403) { //에러메세지 로그 없이 처리하려할때
            console.log("403");
        }
    }).catch(error => {
        console.log({ error });
        if (error.response.status === 403) {
            alert(`${error.response.data.message}`);
        }
    });


}

export default UserInfo
