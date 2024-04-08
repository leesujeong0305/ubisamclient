import axios from "axios";

//axios 객체 생성
const Axios = axios.create({
    baseURL: 'http://14.58.108.70:8877',
    withCredentials: true, // 쿠키를 요청과 함께 전송하도록 설정
});

export default Axios;