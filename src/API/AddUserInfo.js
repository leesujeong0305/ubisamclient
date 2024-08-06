import Axios from './AxiosApi';


export const AddUserInfo = async (item, site) => {
  const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
  //console.log('ip set : ', ip);
  //const ip = `http://localhost:8877`;
  console.log('item : ', item);
  return await Axios.post(`${ip}/addUserInfo`, {
    ID: item.id,
    Name: item.name,
    Password: item.password,
    Department: item.department,
    Email: item.email,
    Rank: item.rank,
    JoinDate: item.join_date,
    Birthday: item.birthday,
    Site: site,
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