import React, { useEffect, useState } from 'react';
import ProjectTable from './ProjectManager/ProjectTable';
import { GetProjectInfo } from '../../../API/GetProjectInfo';
import { useSelector } from 'react-redux';


const ProjectManager = () => {
  const isLogged = useSelector(state => state.auth.isLoggedIn);
  const {authUserId, authUserName, authUserRank, authUserTeam} = useSelector(state => state.userInfo);
  const [projectData, setProjectData] = useState([]);
  const [site, setSite] = useState("");
  const [update, setUpdate] = useState("");

  const Continents = [ /* 상태 색상 표기 */
    { key: '자동화1팀', value: '파주' },
    { key: '시스템사업팀', value: '구미' },
  ];

  const selectSite = () => {
    if (authUserTeam === undefined)
      return;
    const found = Continents.find((item) => item.key === authUserTeam);
    return found ? found.value : undefined;
  }

  const LoadAllProjectInfo = async () => {
    const val = selectSite();
    setSite(val);
    const data = await GetProjectInfo("All", val);
    //console.log('project data', data);
    if (data === undefined)
      return;
    
    const dataWithIds = data.map((item, index) => ({
      id: index + 1, // id 필드 추가, 1부터 시작하는 고유한 값
      Project: item.ProjectName,
      ...item
      
    }));
    //console.log('dataWithIds', dataWithIds);
    setProjectData(dataWithIds);
  }

  const handleUpdate = (data) => {
    if (data === undefined)
      return;
    console.log('setUpdate', data);
    setUpdate(data);
    if (data === true) {
      LoadAllProjectInfo();
    }
  }

  useEffect(() => {
    if (isLogged === true) {
    LoadAllProjectInfo();
    
    }
  }, [isLogged])

  return (
    <div>
      <ProjectTable projects={projectData} site={site} handleUpdate={handleUpdate} />
    </div>
  );
};

export default ProjectManager;