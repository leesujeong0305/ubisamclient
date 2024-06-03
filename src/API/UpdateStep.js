import Axios from './AxiosApi';


export const UpdateStep = async (selectedProjectName, step) => {
  const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
  //console.log('ip set : ', ip);
  //const ip = `http://localhost:8877`;
  return await Axios.post(`${ip}/updateStep`, {
    ProjectName: selectedProjectName,
    Step: step,
  }, {
    headers: {
      "Content-Type": "application/json",
      withCredentials: true,
    }
  }).then(response => {
    console.log("Path 저장 완료", response);
  }).catch(error => {
    console.error("path 저장 실패", error);
    //return error;
  });
}