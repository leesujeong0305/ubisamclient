import React from 'react'
import Cookies from 'js-cookie';
import Axios from './AxiosApi';


export const getNewRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    // 리프레시 토큰이 없는 경우 즉시 함수를 종료합니다.
    if (!refreshToken) {
        console.log("리프레시 토큰이 없습니다. 로그인이 필요합니다.");
        //alert("로그인이 필요합니다.");
        // 필요한 추가 로직을 여기에 구현하세요.
        return;
    }

    try {
        const ip = process.env.REACT_APP_API_DEV === 1 ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        console.log('ip set : ', ip);
        const response = await Axios.post(`${ip}/refresh`, {
            refreshToken,
        });
    
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        console.log("새 액세스 토큰이 발급되었습니다.");
    } catch (error) {
        console.error("액세스 토큰 재발급 실패", error);
        localStorage.clear();
        console.log("접근 권한이 없습니다. 로그인이 필요합니다.");
        
        return error;
    }

}

