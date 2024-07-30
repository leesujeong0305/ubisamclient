import Axios from './AxiosApi';

export const GetProject = async (name, id, manager, site) => {
//const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
const ip = `http://localhost:8877`;
return await Axios.get(`${ip}/BoardProject?Name=${encodeURIComponent(name)}&ID=${encodeURIComponent(id)}&Manager=${encodeURIComponent(manager)}&Site=${encodeURIComponent(site)}`, { //get은 body없음
    headers: {
        "Content-Type": "application/json",
        withCredentials: true,
    }
}).then((res) => {
    //console.log('getProject', { res });
    if (res.data) {
        //console.log('잘 옴 ? ', res.data);
        const dataRow = res.data.map((item, index) => ({
            id: index + 1,
            text: item.ProjectName,
            period: item.Period,
            status: item.Status,
            pm: item.PM
        }));
        return dataRow;
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