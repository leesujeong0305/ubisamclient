import Axios from './AxiosApi';


export const GetIndex = async (data) => {
  const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
  //console.log('ip set : ', ip);

    console.log('LoadListIndex', data);

  //const ip = `http://14.58.108.70:8877`;
    return await Axios.post(`${ip}/LoadListIndex`, {
        ProjectName: data.ProjectName,
        Date: data.Date,
        Name: data.Name,
        Title: data.Title,
        Content: data.Content,
        Status: data.Status,
  }, {
    headers: {
      "Content-Type": "application/json",
      withCredentials: true,
    }
  }).then(response => {
    console.log("Index 가져오기 성공", response);
    return response.data;
  }).catch(error => {
    console.error("Index 가져오기 실패", error);
    //return error;
  });
}