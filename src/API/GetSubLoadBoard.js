import Axios from './AxiosApi';

function GetSubLoadBoard(ProjectName, site) {
    let project = ''
    const name = localStorage.getItem('userToken');
    const _ProjectName = ProjectName.replace(/ /g, '_');
    const index = _ProjectName.indexOf('(');
    if (index !== -1) {
        project = _ProjectName.substring(0, index);
    }
    else project = _ProjectName; // '(' 기호가 없는 경우, 전체 텍스트 반환
    const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
    //const ip = `http://localhost:8877`;
    return Axios.post(`${ip}/subLoadBoard`, {
        ProjectName: ProjectName,
        _ProjectName: project,
        Site: site,
    }, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then((res) => {
        
        if (res.data) {
            const dataRow = res.data;
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

export default GetSubLoadBoard