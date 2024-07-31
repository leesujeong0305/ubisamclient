import Axios from './AxiosApi';


export const DeleteTeamProject = async (row, site) => {
  const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
  //console.log('row : ', row);
  //const ip = `http://localhost:8877`;
  return await Axios.post(`${ip}/deleteTeamProject`, {
    ProjectName: row,
    //Date: row.Date,
    //Status: row.Status,
    //StartMonth: row.StartMonth,
    //EndMonth: row.EndMonth,
    //Users: row.Users,
    //ProopsMM: row.ProopsMM,
    //Manager: row.Manager,
    Site: site,
  }, {
    headers: {
      "Content-Type": "application/json",
      withCredentials: true,
    }
  }).then(response => {
    console.log("프로젝트 삭제 완료", response.data);
    return response.data;
  }).catch(error => {
    console.error("삭제 실패", error);
    return {result: 'FAIL', error};
  });
}