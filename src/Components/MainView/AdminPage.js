import React from 'react'
import axios from 'axios';


function AdminPage() {
    const getAccessToken = () => {
      const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
        axios.delete(`${ip}/logouts`)
        .then(response => {
            if (response.status === 204)
                console.log(response.data); // 서버로부터의 응답 처리
            else if (response.status === 401)
            {
                //get accesstoken
            }
            
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

  return (
    <div>
      <button onClick={getAccessToken}>accesstoken가져오기</button>
    </div>
  )
}

export default AdminPage