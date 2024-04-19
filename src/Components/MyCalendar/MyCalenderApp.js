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
        console.log(res.data);
        const dataRow = res.data.map((item, index) => ({
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

  const LoadPersnalBoard = async () => {
    const data = await getPersnalBoard_DB();
    SetBoardData(data);
    const name = localStorage.getItem('userToken');
    setUserName(name);
    //console.log('load', data);
  }

  //   const handleData = (newData) => {
  //     console.log('load', data);
  //     setData(newData);
  // };


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