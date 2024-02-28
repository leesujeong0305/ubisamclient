import axios from 'axios';

// login 함수 정의
const login = (email, password) => {
    axios.post(`http://localhost:8080/login`, {
        email: email,
        password: password,
    }, {
        headers: {
            "Content-Type": "application/json",
        }
    }
        )
        .then(response => {
            console.log(response.data); // 서버로부터의 응답 처리
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
};

export default login