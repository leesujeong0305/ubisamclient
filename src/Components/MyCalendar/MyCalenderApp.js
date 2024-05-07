import React, { useState, useEffect } from 'react';
import Axios from '../../API/AxiosApi';
import './MyCalenderApp.css';
import FullCalendarComponent from "./FullCalendarComponent"
import Today from "./Today"
import SelectItems from "./SelectItems"
import CustomDatePicker from './DatePicker/CustomDatePicker';

const Item = ({ name, number, additionalClass }) => {
  return (
    <div className={`item ${additionalClass}`}>
      {name} {number}
    </div>
  );
};

const MyCalenderApp = () => {
  // 초기 상태로 '전 체'를 지정합니다.
  const [select, setSelect] = useState(new Set());
  const [boardData, SetBoardData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  //const [data, setData] = useState(false);
  const [getData, GetBoardData] = useState("");
  const [userName, setUserName] = useState("");

  const getPersnalBoard_DB = async () => {
    const name = localStorage.getItem('userToken');
    const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
    return await Axios.get(`${ip}/boardPersnal?Name=${name}`, { //get은 body없음
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
      if (res.data) {
        console.log('getPersnalBoard_DB',res.data);
        const dataRow = res.data.map((item, index) => ({
          title: item.Title,
          index: item.Index,
          project: item.ProjectName,
          date: item.Date,
          Name: item.Name,
          content: item.Content,
          category: item.Status,
          backgroundColor: (item.Status === '대기' ? '#CCCCFF' : item.Status === '진행중' ? '#ADD8E6' : item.Status === '완료' ? '#FFD700' : item.Status === '이슈' ? '#FFC0CB' : '#fff'),
          borderColor:     (item.Status === '대기' ? '#CCCCFF' : item.Status === '진행중' ? '#ADD8E6' : item.Status === '완료' ? '#FFD700' : item.Status === '이슈' ? '#FFC0CB' : '#fff'),
          textColor: '#333'
        }));
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
  };

  const SubBoardData = async ( data ) => {
    // const processedData = data.map(({ title, Name, project }) => {
    //   return { title, Name, project };
    // });
    // console.log('getSubPersnalBoardData 60',processedData);

      // Initialize a Set to keep track of unique project names
    const uniqueProjects = new Set();

    const processedData = data.map(item => {
      // Extract the properties you need
      const { Name,project } = item;
      return { Name,project };
    }).filter(item => {
      // Filter out duplicates based on the 'project' property
      const isDuplicate = uniqueProjects.has(item.project);
      uniqueProjects.add(item.project);
      return !isDuplicate;
    });

    console.log('Unique Project Data', processedData);
    return processedData;
  
  };

  const LoadPersnalBoard = async () => {
    const data = await getPersnalBoard_DB();
    //SetBoardData(data);
    // sub
    const subdata = await SubBoardData(data);
    const subsubdata = await subLoadBoard(subdata);
    const result = [...data, ...subsubdata];
    SetBoardData(result);
    console.log("LoadPersnalBoard 91",subsubdata);
    console.log("LoadPersnalBoard 91",result);


    const name = localStorage.getItem('userToken');
    setUserName(name);
    //console.log('load', data);
  }
  const subLoadBoard = async (subdata) => {
    // Retrieve the user token from localStorage
    const name = localStorage.getItem("userToken");
    console.log("subLoadBoard 98", subdata);
    // Check if subdata is an array and has items
    if (!Array.isArray(subdata) || subdata.length === 0) {
      console.log("No subdata provided or subdata is empty");
      return [];
    }

    // Determine the API endpoint
    const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;

    // The results array will collect the responses
    const results = [];
    let project = '';
    const _Name = subdata[0].Name;
    console.log("subLoadBoard 113",_Name);
    for (const item of subdata) {
      // Replace spaces with underscores in the project name
      const _ProjectName = item.project.replace(/ /g, "_");
      const index = _ProjectName.indexOf('(');
        if (index !== -1) {
            project = _ProjectName.substring(0, index);
        }
        else project = _ProjectName; // '(' 기호가 없는 경우, 전체 텍스트 반환
      try {
        const res = await Axios.post(
          `${ip}/subLoadBoard`,
          {
            ProjectName: item.project,
            _ProjectName: project,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data) {
          console.log("subLoadBoard 124", res.data);

          results.push(res.data); // Collect the successful response
        } else if (res.data.code === 403) {
          console.log(
            "403 Forbidden - the server understood the request but refuses to authorize it."
          );
          // Handle 403 error if needed, perhaps pushing an error object onto results
        }
      } catch (error) {
        console.error("Request failed for project", _ProjectName, error);
        if (error.response && error.response.status === 403) {
          alert(`${error.response.data.message}`);
        }
        // Depending on your error handling, you might want to continue or break the loop
      }
    }
   
    const filteredResults = results.map(innerArray => 
      innerArray.filter(item => item.Name === _Name)
    );

    // Check if there are any filtered results in the first array
    const dataRows = filteredResults.flatMap((innerArray, arrayIndex) => {
      if (innerArray.length > 0) {
        return innerArray.map(item => ({
          title: item.Title,
          index: item.Index,
          project: item.ProjectName,
          date: item.Date,
          Name: item.Name,
          content: item.Content,
          category: item.Status,
          backgroundColor: (item.Status === '대기' ? '#CCCCFF' : item.Status === '진행중' ? '#ADD8E6' : item.Status === '완료' ? '#FFD700' : item.Status === '이슈' ? '#FFC0CB' : '#fff'),
          borderColor: (item.Status === '대기' ? '#CCCCFF' : item.Status === '진행중' ? '#ADD8E6' : item.Status === '완료' ? '#FFD700' : item.Status === '이슈' ? '#FFC0CB' : '#fff'),
          textColor: '#333'
        }));
      } else {
        console.log(`No items match the name in array index ${arrayIndex} or it is empty.`);
        return []; // 이 배열은 비어있거나 해당 이름을 가진 아이템이 없습니다.
      }
    });
    return dataRows;
  };


  useEffect(() => {
    LoadPersnalBoard();
  }, [])

  return (
    <div className="my-calender h-100">
      <div className="left-column">
        <div className="select-container">
          <div className="calendar-grid h-30 ">
            <CustomDatePicker name={userName} boardData={boardData} />
          </div>
        </div>

        {/* 선택 항목 컴포넌트에 현재 선택된 항목과 선택을 변경하는 함수를 전달합니다. */}
        <SelectItems select={select} setSelect={setSelect} />
        <Today className="item-normal" getData={getData} />
      </div>
      <div className="right-column">
        {/* 달력 컴포넌트에 현재 선택된 항목을 전달합니다. */}
        <FullCalendarComponent className="item-extra-large" selectedCategory={select} boardData={boardData} GetBoardData={GetBoardData} />
      </div>
    </div>
  );
};

export default MyCalenderApp;