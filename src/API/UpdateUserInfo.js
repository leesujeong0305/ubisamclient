import Axios from './AxiosApi';

export const UpdateUserInfo = async (item, filed) => {
    const id = localStorage.getItem('userEmailToken');
    const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
    //const ip = `http://localhost:8877`;
    if ((Array.isArray(item) || filed === 'ProjectView') && filed !== undefined) {
        return await Axios.post(`${ip}/updateUserInfo`, {
            ID: id,
            ProjectView: item,
            Filed : filed,
        }, {
            headers: {
                "Content-Type": "application/json",
                withCredentials: true,
            }
        }).then(response => {
            //console.log("View 업데이트 완료", response);
        }).catch(error => {
            console.error("워터마크 저장 실패", error);
            return error;
        });
    } else if ((Array.isArray(item) || filed !== 'ProjectView') && filed !== undefined) {
        return await Axios.post(`${ip}/updateUserInfo`, {
            ID: item.id,
            Name: item.name,
            Birthday: item.birthday,
            Email: item.email,
            Department: item.department,
            Rank: item.rank,
            JoinDate: item.join_date,
            Filed: filed, //Site
        }, {
            headers: {
                "Content-Type": "application/json",
                withCredentials: true,
            }
        }).then(response => {
            //console.log("View 업데이트 완료", response);
        }).catch(error => {
            //console.error("워터마크 저장 실패", error);
            //return error;
        });
    } else {
        return await Axios.post(`${ip}/updateUserInfo`, {
            ID: id,
            Custom: item,
        }, {
            headers: {
                "Content-Type": "application/json",
                withCredentials: true,
            }
        }).then(response => {
            console.log("워터마크 저장 완료", response);
        }).catch(error => {
            console.error("워터마크 저장 실패", error);
            //return error;
        });
    }
}