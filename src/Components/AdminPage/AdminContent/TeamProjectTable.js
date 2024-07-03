import React from 'react';
import AdminTeamBulletin from './TeamProjectTable/AdminTeamBulletin'

const TeamProjectTable = () => {

    const data = [
        {
          Index: 1,
          ProjectName: "P8 ~ P8E ADR+ Development",
          Part: 1,
          State: "Setup",
          Users: "Gildong",
          StartMonth: 1,
          EndMonth: 3,
          Months: 2, // 진행률 바가 표시될 개월 수
          Progress: 80, // 진행률 백분율
          Desc: "2021년 3분기에 청구 예정"
        },
        {
          Index: 2,
          ProjectName: "AP4 MTO setup and ADJ development",
          Part: 1,
          State: "Production Setup",
          Users: "Hong Ki-dong",
          StartMonth: 1,
          EndMonth: 10,
          Months: 8, // 진행률 바가 표시될 개월 수
          Progress: 80, // 진행률 백분율
          Desc: ""
        },
        {
          Index: 3,
          ProjectName: "XYZ Project Phase 1",
          Part: 2,
          State: "Initiation",
          Users: "Kim Yuna",
          StartMonth: 1,
          EndMonth: 5,
          Months: 4, // 진행률 바가 표시될 개월 수
          Progress: 60, // 진행률 백분율
          Desc: "승인 대기 중"
        },
        {
          Index: 4,
          ProjectName: "Alpha Beta Gamma Integration",
          Part: 3,
          State: "Development",
          Users: "Lee Minho",
          StartMonth: 1,
          EndMonth: 7,
          Months: 6, // 진행률 바가 표시될 개월 수
          Progress: 50, // 진행률 백분율
          Desc: "모듈 B에서 기술적 문제 발생"
        },
        {
          Index: 5,
          ProjectName: "Data Migration for XYZ Corp",
          Part: 1,
          State: "Planning",
          Users: "Park Jisoo",
          StartMonth: 1,
          EndMonth: 5,
          Months: 4, // 진행률 바가 표시될 개월 수
          Progress: 30, // 진행률 백분율
          Desc: "자원 할당 필요"
        },
        {
          Index: 6,
          ProjectName: "Mobile App Launch",
          Part: 2,
          State: "Testing",
          Users: "Choi Sooyoung",
          StartMonth: 1,
          EndMonth: 7,
          Months: 6, // 진행률 바가 표시될 개월 수
          Progress: 90, // 진행률 백분율
          Desc: "버그 수정 진행 중"
        },
        {
          Index: 7,
          ProjectName: "Cloud Infrastructure Setup",
          Part: 3,
          State: "Deployment",
          Users: "Kim Taehyung",
          StartMonth: 1,
          EndMonth: 8,
          Months: 6, // 진행률 바가 표시될 개월 수
          Progress: 75, // 진행률 백분율
          Desc: "보안 검토 대기 중"
        }
      ];

  return (
    <div>
        <AdminTeamBulletin data={data} />
    </div>
  );
};

export default TeamProjectTable;