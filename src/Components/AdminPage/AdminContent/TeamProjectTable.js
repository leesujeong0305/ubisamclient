import React, { useEffect, useState } from 'react';
import AdminTeamBulletin from './TeamProjectTable/AdminTeamBulletin'
import TeamProjectBoard from './TeamProjectTable/TeamProjectBoard';
import { GetTeamProject } from '../../../API/GetTeamProject';
import { useSelector } from 'react-redux';

const TeamProjectTable = () => {
  const { authUserId, authUserName, authUserRank, authUserTeam, authManager } = useSelector((state) => state.userInfo);
  const [loadData, setLoadData] = useState([]);
  const [update, setUpdate] = useState("");

  const Continents = [
    { key: '자동화1팀', value: ['파주'] },
    { key: '시스템사업팀', value: ['구미'] },
    // { key: '장비사업팀', value: '서울' },
    { key: '장비사업팀', value: ['서울', '파주'] },
    { key: 'ReadOnly', value: ['파주'] },
  ];

  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const selectSite = () => {
    if (authUserTeam === undefined) return;
    const found = Continents.find((item) => item.key === authUserTeam);
    return found ? found.value : undefined;
  };
  // const data = [
  //   {
  //     index: 1,
  //     Project: "P8 ~ P8E ADR+ Development",
  //     Date: "2024-01-08",
  //     Part: 1,
  //     Status: "Setup",
  //     Manager: 'PRI 홍길동 연구원',
  //     Users: "김철수, 이수정, 홍길동",
  //     StartMonth: 1,
  //     EndMonth: 3,
  //     Months: 2, // 진행률 바가 표시될 개월 수
  //     Progress: 80, // 진행률 백분율
  //     ProopsMM: 1.2,
  //     Cost: 1,
  //     Desc: "2021년 3분기에 청구 예정"
  //   },
  //   {
  //     index: 2,
  //     Project: "AP4 MTO setup and ADJ development",
  //     Date: "2024-01-22",
  //     Part: 1,
  //     Status: "Production Setup",
  //     Manager: '김철수',
  //     Users: "김철수, 홍길동",
  //     StartMonth: 1,
  //     EndMonth: 10,
  //     Months: 8, // 진행률 바가 표시될 개월 수
  //     ProopsMM: 1.2,
  //     Post: 2,
  //     Crogress: 80, // 진행률 백분율
  //     Desc: ""
  //   },
  //   {
  //     index: 3,
  //     Project: "XYZ Project Phase 1",
  //     Date: "2024-09-14",
  //     Part: 2,
  //     Status: "Initiation",
  //     Manager: '홍길동',
  //     Users: "김철수, 이수정, 홍길동, 아무개",
  //     StartMonth: 9,
  //     EndMonth: 11,
  //     Months: 2, // 진행률 바가 표시될 개월 수
  //     Progress: 60, // 진행률 백분율
  //     ProopsMM: 1.2,
  //     Cost: 2,
  //     Desc: "승인 대기 중"
  //   },
  //   {
  //     index: 4,
  //     Project: "Alpha Beta Gamma Integration",
  //     Date: "2024-03-03",
  //     Part: 3,
  //     Status: "Development",
  //     Manager: '김철수',
  //     Users: "아무개",
  //     StartMonth: 3,
  //     EndMonth: 6,
  //     Months: 1.5, // 진행률 바가 표시될 개월 수
  //     Progress: 50, // 진행률 백분율
  //     ProopsMM: 1.2,
  //     Cost: 1,
  //     Desc: "모듈 B에서 기술적 문제 발생"
  //   },
  //   {
  //     index: 5,
  //     Project: "Data Migration for XYZ Corp",
  //     Date: "2024-01-01",
  //     Part: 1,
  //     Status: "Planning",
  //     Manager: '홍길동',
  //     Users: "이수정, 홍길동",
  //     StartMonth: 1,
  //     EndMonth: 5,
  //     Months: 4, // 진행률 바가 표시될 개월 수
  //     Progress: 30, // 진행률 백분율
  //     ProopsMM: 1.2,
  //     Cost: 2,
  //     Desc: "자원 할당 필요"
  //   },
  //   {
  //     index: 6,
  //     Project: "Mobile App Launch",
  //     Date: "2024-01-10",
  //     Part: 2,
  //     State: "Testing",
  //     Manager: '김철수',
  //     Users: "김철수, 홍길동, 아무개",
  //     StartMonth: 1,
  //     EndMonth: 7,
  //     Months: 6, // 진행률 바가 표시될 개월 수
  //     Progress: 90, // 진행률 백분율
  //     ProopsMM: 1.2,
  //     Cost: 1,
  //     Desc: "버그 수정 진행 중"
  //   },
  //   {
  //     index: 7,
  //     Project: "Cloud Infrastructure Setup",
  //     Date: "2024-01-15",
  //     Part: 3,
  //     Status: "Deployment",
  //     Manager: '홍길동',
  //     Users: "이수정, 홍길동",
  //     StartMonth: 1,
  //     EndMonth: 8,
  //     Months: 6, // 진행률 바가 표시될 개월 수
  //     Progress: 75, // 진행률 백분율
  //     ProopsMM: 1.2,
  //     Cost: 3,
  //     Desc: "보안 검토 대기 중"
  //   },
  //   {
  //     index: 8,
  //     Project: "2023 year test",
  //     Date: "2023-02-15",
  //     Part: 3,
  //     Status: "Deployment",
  //     Manager: '김철수',
  //     Users: "김철수",
  //     StartMonth: 1,
  //     EndMonth: 7,
  //     Months: 6, // 진행률 바가 표시될 개월 수
  //     Progress: 75, // 진행률 백분율
  //     ProopsMM: 1.2,
  //     Cost: 2,
  //     Desc: "보안 검토 대기 중"
  //   },
  //   {
  //     index: 9,
  //     Project: "2023 year test2",
  //     Date: "2023-01-15",
  //     Part: 3,
  //     Status: "Deployment",
  //     Manager: '홍길동',
  //     Users: "김철수, 이수정, 홍길동, 아무개",
  //     StartMonth: 3,
  //     EndMonth: 6,
  //     Months: 2, // 진행률 바가 표시될 개월 수
  //     Progress: 75, // 진행률 백분율
  //     ProopsMM: 1.2,
  //     Cost: 2,
  //     Desc: "보안 검토 대기 중"
  //   },
  //   {
  //     index: 10,
  //     Project: "2023 year Test3",
  //     Date: "2023-09-20",
  //     Part: 3,
  //     Status: "Deployment",
  //     Manager: '김철수',
  //     Users: "김철수, 이수정, 홍길동, 아무개",
  //     StartMonth: 6,
  //     EndMonth: 12,
  //     Months: 4, // 진행률 바가 표시될 개월 수
  //     Progress: 75, // 진행률 백분율
  //     ProopsMM: 1.2,
  //     Cost: 3,
  //     Desc: "보안 검토 대기 중"
  //   }
  // ];

  const LoadTeameProject = async () => {
    const siteList = selectSite();
    //const data = await GetTeamProject(site);
    let mainData = [];
    for (const site of siteList) {
      const data = await GetTeamProject(site);
      mainData = [...mainData, ...data];
    }
    
    if (mainData === undefined)
      return;
    const dataWithIds = mainData.map((item, index) => ({
      id: index + 1,
      Project: item.ProjectName,
      EndWeek:item.EndWeek - 3,
      EndMonth:item.EndMonth + 1,
      Percent: calculatePercentage(item),
      AfterWeek: delayWeek(item),//지연 및 진행도 %표시에 필요
      BlankAfter: blankWeekAfter(item.EndMonth, item.EndWeek),
      ...item
    }));
    setLoadData(dataWithIds);
  };

  const handleUpdate = (data) => {
    if (data === undefined)
      return;
    //console.log('setUpdate', data);
    setUpdate(data);
    if (data === true) {
      LoadTeameProject();
    }
    setUpdate(false);
  }

  const calculatePercentage = (row) => {
    const hundred = 100;
    let percentage = 0;
    const year = row.Date.split("-")[0];
    const isPastYear = year < currentYear;
    if (isPastYear)
      return '100';
    
    const day = today.getDate() > 23 ? 3 : today.getDate() > 16 ? 2 : today.getDate() > 9 ? 1 : 0;
    

    if (currentMonth > row.EndMonth || ((currentMonth === row.EndMonth) && day >= row.EndWeek))
      return hundred.toFixed(0);
    if (row.StartMonth > row.EndMonth)
      return hundred.toFixed(0);
    if (row.StartMonth > currentMonth || ((currentMonth === row.StartMonth) && day < row.StartWeek))
      return 0;

    if (row.Status - 1 === 6) {
     return hundred.toFixed(0);
    }

    if (row.StartMonth === 1) {
      if (row.StartWeek === 1) {
        const ratio = (row.EndMonth * 4) - (4 - row.EndWeek);
        const period = (currentMonth * 4) - (4 - day);
        percentage = period / ratio * 100;
      } else {
        const ratio = (row.EndMonth * 4) - (row.StartWeek - 1) - (4 - row.EndWeek);
        const period = (currentMonth * 4) - (row.StartWeek - 1) - (4 - day);
        percentage = period / ratio * 100;
      }
    } else {
      const ratio = ((row.EndMonth - row.StartMonth - 1) * 4) + (4 - (row.StartWeek - 1)) + row.EndWeek;
      const period = ((currentMonth - row.StartMonth - 1) * 4) + (4 - (row.StartWeek - 1)) + day;
      percentage = (period / ratio) * 100;
    }
    //console.log('날짜 계산', percentage);
    return percentage.toFixed(0);
  };

  const delayWeek = (row) => {
    const year = row.Date.split("-")[0];
    const isPastYear = year < currentYear;
    if (isPastYear) {
      const day = 3; // 12월 4째주를 나타내는 고정 값
    const per = ((12 - row.EndMonth) * 4) - (row.EndWeek - 4); // 12월로 고정
    return per;
    }
      

    const day = today.getDate() > 23 ? 3 : today.getDate() > 16 ? 2 : today.getDate() > 9 ? 1 : 0;
    const per = ((currentMonth - row.EndMonth) * 4) - (row.EndWeek - day);
    
    return per;
  }

  const blankWeekAfter = (month, week) => {
    if (month === 12) {
      if (week === 4)
        return 0;
      if (week === 3)
        return 1;
      if (week === 2)
        return 2;
      if (week === 1)
        return 3;
    } else {
      return 48 - ((month) * 4) + (4 - week);
    }
  }

  useEffect(() => {
    LoadTeameProject();
  }, []);
  
  return (
    <div>
      <TeamProjectBoard posts={loadData} handleUpdate={handleUpdate} />
    </div>
  );
};

export default TeamProjectTable;