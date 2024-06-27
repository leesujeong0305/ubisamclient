import React, { useEffect, useState } from 'react';
import ProjectTable from './ProjectManager/ProjectTable';
import { GetProjectInfo } from '../../../API/GetProjectInfo';
import { useSelector } from 'react-redux';


const ProjectManager = () => {
  const isLogged = useSelector(state => state.auth.isLoggedIn);
  const [projectData, setProjectData] = useState([]);
  const projects = [
    {
      name: 'ELA',
      type: '1파트',
      pm: '홍길동',
      personnel: ['홍길동', '이순신', '강감찬', '유관순', '세종대왕'],
      status: '시작전',
      startDate: '2018-09-21 ~ 2019-12-28',
      View: true,
      // progress: 100,
    },
    {
      name: '패턴',
      type: '2파트',
      pm: 'sysadmin',
      personnel: ['까치', '둘리', '루피'],
      status: '시작전',
      startDate: '2019-07-23 ~ 2021-03-08',
      View: true,
      // progress: 72,
    },
  ];

  const LoadAllProjectInfo = async () => {
    const data = await GetProjectInfo("All");
    if (data === undefined)
      return;
    const dataWithIds = data.map((item, index) => ({
      id: index + 1, // id 필드 추가, 1부터 시작하는 고유한 값
      ...item
    }));
    setProjectData(dataWithIds);
  }

  useEffect(() => {
    if (isLogged === true) {
    LoadAllProjectInfo();
    }
  }, [isLogged])

  return (
    <div>
      <ProjectTable projects={projectData} />
    </div>
  );
};

export default ProjectManager;