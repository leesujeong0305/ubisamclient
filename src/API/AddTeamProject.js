import Axios from './AxiosApi';


export const AddTeamProject = async (row, site) => {
  const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
  //const ip = `http://localhost:8877`;
  return await Axios.post(`${ip}/addTeamProject`, {
    ProjectName: row.Project,
    Date: row.Date,
    Status: row.Status,
    StartMonth: row.StartMonth,
    StartWeek: row.StartWeek,
    EndMonth: row.EndMonth,
    EndWeek: row.EndWeek,
    Users: row.Users,
    ProopsMM: row.ProopsMM,
    Manager: row.Manager,
    Site: site,
  }, {
    headers: {
      "Content-Type": "application/json",
      withCredentials: true,
    }
  }).then(response => {
    //console.log("프로젝트 추가 완료", response.data);
    return response.data;
  }).catch(error => {
    console.error("추가 실패", error);
    return {result: 'FAIL', error};
  });
}