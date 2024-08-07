import Axios from './AxiosApi';


export const UpdateGitPage = async (path, selectedProjectName) => {
  const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
  //console.log('ip set : ', ip);
  //const ip = `http://localhost:8877`;
  return await Axios.post(`${ip}/updateGitPagePath`, {
    url: path,
    ProjectName: selectedProjectName,
  }, {
    headers: {
      "Content-Type": "application/json",
      withCredentials: true,
    }
  }).then(response => {
    console.log("Git 페이지 연결 완료", response);
    return response.data;
  }).catch(error => {
    console.error("path 실패", error);
    console.log("path 실패", path);
    return {result: 'FAIL', error};
  });
}