import Axios from './AxiosApi';


export const UpdateProjectInfo = async (row) => {
  //const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
  //console.log('ip set : ', ip);
  const ip = `http://localhost:8877`;
  return await Axios.post(`${ip}/updateProjectInfo`, {
    ProjectName: row.Project,
    Period: row.Period,
    Users: row.Users,
    Status: row.Status,
    PM: row.PM,
    Site: row.Site,
    View: row.View,
  }, {
    headers: {
      "Content-Type": "application/json",
      withCredentials: true,
    }
  }).then(response => {
    console.log("프로젝트 추가 완료", response);
    return response.data;
  }).catch(error => {
    console.error("추가 실패", error);
    return {result: 'FAIL', error};
  });
}