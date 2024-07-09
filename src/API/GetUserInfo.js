import Axios from './AxiosApi';

function GetUserInfo(userEmail ,authUserTeam){
    const token = localStorage.getItem('userToken');
    const emailToken = localStorage.getItem('userEmailToken');
    //const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
    const ip = `http://localhost:8877`;
    if (authUserTeam === undefined) {
        return Axios.get(`${ip}/getUserInfo?userEmail=${encodeURIComponent(emailToken)}&name=${encodeURIComponent(token)}`, { //get은 body없음
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            if (res.data.userData) {
                //console.log('userdata',res.data.userData);
    
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
    } else {
        return Axios.get(`${ip}/getUserInfo?userEmail=${userEmail}&name=${authUserTeam}`, { //get은 body없음
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            if (res.data) {
                console.log('userdata',res.data.user);
    
                return res.data.user;
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
    


}

export default GetUserInfo