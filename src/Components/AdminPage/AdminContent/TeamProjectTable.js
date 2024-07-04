import React from 'react';
import AdminTeamBulletin from './TeamProjectTable/AdminTeamBulletin'

const TeamProjectTable = () => {

    const data = [
        {
          index: 1,
          projectName: "P8 ~ P8E ADR+ Development",
          part: 1,
          state: "Setup",
          users: "Gildong",
          startMonth: 1,
          endMonth: 3,
          months: 2, // 진행률 바가 표시될 개월 수
          progress: 80, // 진행률 백분율
          desc: "2021년 3분기에 청구 예정"
        },
        {
          index: 2,
          projectName: "AP4 MTO setup and ADJ development",
          part: 1,
          state: "Production Setup",
          users: "Hong Ki-dong",
          startMonth: 1,
          endMonth: 10,
          months: 8, // 진행률 바가 표시될 개월 수
          progress: 80, // 진행률 백분율
          desc: ""
        },
        {
          index: 3,
          projectName: "XYZ Project Phase 1",
          part: 2,
          state: "Initiation",
          users: "Kim Yuna",
          startMonth: 9,
          endMonth: 11,
          months: 2, // 진행률 바가 표시될 개월 수
          progress: 60, // 진행률 백분율
          desc: "승인 대기 중"
        },
        {
          index: 4,
          projectName: "Alpha Beta Gamma Integration",
          part: 3,
          state: "Development",
          users: "Lee Minho",
          startMonth: 3,
          endMonth: 6,
          months: 1.5, // 진행률 바가 표시될 개월 수
          progress: 50, // 진행률 백분율
          desc: "모듈 B에서 기술적 문제 발생"
        },
        {
          index: 5,
          projectName: "Data Migration for XYZ Corp",
          part: 1,
          state: "Planning",
          users: "Park Jisoo",
          startMonth: 1,
          endMonth: 5,
          months: 4, // 진행률 바가 표시될 개월 수
          progress: 30, // 진행률 백분율
          desc: "자원 할당 필요"
        },
        {
          index: 6,
          projectName: "Mobile App Launch",
          part: 2,
          state: "Testing",
          users: "Choi Sooyoung",
          startMonth: 1,
          endMonth: 7,
          months: 6, // 진행률 바가 표시될 개월 수
          progress: 90, // 진행률 백분율
          desc: "버그 수정 진행 중"
        },
        {
          index: 7,
          projectName: "Cloud Infrastructure Setup",
          part: 3,
          state: "Deployment",
          users: "Kim Taehyung",
          startMonth: 1,
          endMonth: 8,
          months: 6, // 진행률 바가 표시될 개월 수
          progress: 75, // 진행률 백분율
          desc: "보안 검토 대기 중"
        }
      ];

  return (
    <div>
        <AdminTeamBulletin data={data} />
    </div>
  );
};

export default TeamProjectTable;