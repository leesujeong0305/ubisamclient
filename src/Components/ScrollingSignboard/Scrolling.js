import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import ScrollText from './ScrollText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './Scrolling.css';
import Axios from '../../API/AxiosApi';

const Scrolling = ({ selectedProjectName }) => {
  const bellRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [data, setData] = useState(false);

  useEffect(() => {

    if (data === true) {
    const bellElement = bellRef.current;
    let isPink = true;
    console.log('이거탐?');
      const toggleColor = () => {
        if (isPink) {
          bellElement.style.color = 'yellow';
        } else {
          bellElement.style.color = 'pink';
        }
        isPink = !isPink;
      };
      
      const intervalId = setInterval(toggleColor, 500);
  
      return () => clearInterval(intervalId);
    }  
  }, [data]);


  const deleteAllTasks = () => {
    setTasks([]); // 모든 태스크 삭제
  };

  const loadKanBanList_DB = async () => {
    const ip = process.env.REACT_APP_API_DEV === "true" ? `http://localhost:8877` : `http://14.58.108.70:8877`;
    return await Axios.get(`${ip}/loadKanBanList?Project=${encodeURIComponent(selectedProjectName)}`, { //get은 body없음
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
      //console.log('getProject', { res });
      if (res.data) {
        //console.log('kanban load', res.data);
        return res.data;
      } else if (res.data.code === 403) { //에러메세지 로그 없이 처리하려할때
        console.log("403");
      }
    }).catch(error => {
      console.log({ error });
      if (error.response.status === 403) {
        alert(`${error.response.data.message}`);
      }
    });
  }

  const loadKanBanList = async () => {
    const list = await loadKanBanList_DB(selectedProjectName);
    if (list.length > 0) {
      list.reverse().forEach((item, index) => {
        const newTask = {
          id: index + 1, //`task-${Date.now()}`
          text: item.Content,
          status: item.Status,
        }
        setTasks(prevTasks => [...prevTasks, newTask]);
      })
      //setData(true);
      setData(true);
    } else {
      setData(false);
    }
  }

  useEffect(() => {
    deleteAllTasks();
    setProjectName(selectedProjectName);
    
  }, [selectedProjectName]);

  useEffect(() => {
    if (projectName !== "No Data") {
      loadKanBanList();
    }
  }, [projectName])

  return (
    <>
    { data === true && (
<div className="Scrolling">
        <div className="column bell-column">
          <FontAwesomeIcon icon={faBell} size="2x" ref={bellRef} />
        </div>
        <div className="column text-column start-text">
          <div>이슈 발생</div>
        </div>
        <div className="column scroll-column">
        <ScrollText text={tasks} />
        </div>
        <div className="column text-column end-text">
          <div>관리자는 빨리 조치 해주세요!</div>
        </div>
      </div>
      )}
        
    </>
  );
}

export default Scrolling;