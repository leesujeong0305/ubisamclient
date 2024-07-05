import React from 'react';
import AdminTeamBulletin from './TeamProjectTable/AdminTeamBulletin'
import TeamProjectBoard from './TeamProjectTable/TeamProjectBoard';

const TeamProjectTable = () => {

    const data = [
        {
          index: 1,
          project: "P8 ~ P8E ADR+ Development",
          date: "2024-01-08",
          part: 1,
          state: "Setup",
          manager: 'PRI 홍길동 연구원',
          users: "김철수, 이수정, 홍길동",
          startMonth: 1,
          endMonth: 3,
          months: 2, // 진행률 바가 표시될 개월 수
          progress: 80, // 진행률 백분율
          proopsMM: 1.2,
          cost: 1,
          desc: "2021년 3분기에 청구 예정"
        },
        {
          index: 2,
          project: "AP4 MTO setup and ADJ development",
          date: "2024-01-22",
          part: 1,
          state: "Production Setup",
          manager: '김철수',
          users: "김철수, 홍길동",
          startMonth: 1,
          endMonth: 10,
          months: 8, // 진행률 바가 표시될 개월 수
          proopsMM: 1.2,
          cost: 2,
          progress: 80, // 진행률 백분율
          desc: ""
        },
        {
          index: 3,
          project: "XYZ Project Phase 1",
          date: "2024-09-14",
          part: 2,
          state: "Initiation",
          manager: '홍길동',
          users: "김철수, 이수정, 홍길동, 아무개",
          startMonth: 9,
          endMonth: 11,
          months: 2, // 진행률 바가 표시될 개월 수
          progress: 60, // 진행률 백분율
          proopsMM: 1.2,
          cost: 2,
          desc: "승인 대기 중"
        },
        {
          index: 4,
          project: "Alpha Beta Gamma Integration",
          date: "2024-03-03",
          part: 3,
          state: "Development",
          manager: '김철수',
          users: "아무개",
          startMonth: 3,
          endMonth: 6,
          months: 1.5, // 진행률 바가 표시될 개월 수
          progress: 50, // 진행률 백분율
          proopsMM: 1.2,
          cost: 1,
          desc: "모듈 B에서 기술적 문제 발생"
        },
        {
          index: 5,
          project: "Data Migration for XYZ Corp",
          date: "2024-01-01",
          part: 1,
          state: "Planning",
          manager: '홍길동',
          users: "이수정, 홍길동",
          startMonth: 1,
          endMonth: 5,
          months: 4, // 진행률 바가 표시될 개월 수
          progress: 30, // 진행률 백분율
          proopsMM: 1.2,
          cost: 2,
          desc: "자원 할당 필요"
        },
        {
          index: 6,
          project: "Mobile App Launch",
          date: "2024-01-10",
          part: 2,
          state: "Testing",
          manager: '김철수',
          users: "김철수, 홍길동, 아무개",
          startMonth: 1,
          endMonth: 7,
          months: 6, // 진행률 바가 표시될 개월 수
          progress: 90, // 진행률 백분율
          proopsMM: 1.2,
          cost: 1,
          desc: "버그 수정 진행 중"
        },
        {
          index: 7,
          project: "Cloud Infrastructure Setup",
          date: "2024-01-15",
          part: 3,
          state: "Deployment",
          manager: '홍길동',
          users: "이수정, 홍길동",
          startMonth: 1,
          endMonth: 8,
          months: 6, // 진행률 바가 표시될 개월 수
          progress: 75, // 진행률 백분율
          proopsMM: 1.2,
          cost: 3,
          desc: "보안 검토 대기 중"
        },
        {
          index: 8,
          project: "2023 year test",
          date: "2023-02-15",
          part: 3,
          state: "Deployment",
          manager: '김철수',
          users: "김철수",
          startMonth: 1,
          endMonth: 7,
          months: 6, // 진행률 바가 표시될 개월 수
          progress: 75, // 진행률 백분율
          proopsMM: 1.2,
          cost: 2,
          desc: "보안 검토 대기 중"
        },
        {
          index: 9,
          project: "2023 year test2",
          date: "2023-01-15",
          part: 3,
          state: "Deployment",
          manager: '홍길동',
          users: "김철수, 이수정, 홍길동, 아무개",
          startMonth: 3,
          endMonth: 6,
          months: 2, // 진행률 바가 표시될 개월 수
          progress: 75, // 진행률 백분율
          proopsMM: 1.2,
          cost: 2,
          desc: "보안 검토 대기 중"
        },
        {
          index: 10,
          project: "2023 year Test3",
          date: "2023-09-20",
          part: 3,
          state: "Deployment",
          manager: '김철수',
          users: "김철수, 이수정, 홍길동, 아무개",
          startMonth: 6,
          endMonth: 12,
          months: 4, // 진행률 바가 표시될 개월 수
          progress: 75, // 진행률 백분율
          proopsMM: 1.2,
          cost: 3,
          desc: "보안 검토 대기 중"
        }
      ];

  return (
    <div>
        <TeamProjectBoard posts={data} />
    </div>
  );
};

export default TeamProjectTable;