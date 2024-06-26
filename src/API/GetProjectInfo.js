import Axios from './AxiosApi';


export const GetProjectInfo = async (projectName) => {
    //const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
    //console.log('ip set : ', ip);
    const ip = `http://localhost:8877`;
    return await Axios.get(`${ip}/loadProjectInfo?ProjectName=${encodeURIComponent(projectName)}`, {
        headers: {
            "Content-Type": "application/json",
            withCredentials: true,
        }
    }).then(response => {
        return response.data;
    }).catch(error => {
        console.error("ProjectInfo Load 실패", error);
        //return error;
    });
}