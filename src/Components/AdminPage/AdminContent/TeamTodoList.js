import React, { useEffect, useState } from 'react';
import SearchBar from './TeamTodoList/SearchBar';
import AdminBulletin from './TeamTodoList/AdminBulletin';
import SelectItems from '../../MyCalendar/SelectItems';
import { useSelector } from 'react-redux';
import LoadBoard from '../../../Board/Page/LoadBoard';
import GetSubLoadBoard from '../../../API/GetSubLoadBoard';
import { GetProjectInfo } from '../../../API/GetProjectInfo';

const TeamTodoList = () => {
    const isLogged = useSelector(state => state.auth.isLoggedIn);
    const { authUserId, authUserName, authUserRank, authUserTeam, authManager } = useSelector(state => state.userInfo);

    const [allBoard, setAllBoard] = useState([])
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [project, setProject] = useState(null);
    const [useSerch, setUseSerch] = useState(false);
    

    const [site, setSite] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const Continents = [
        { key: '자동화1팀', value: ['파주'] },
        { key: '시스템사업팀', value: ['구미'] },
        //{ key: '장비사업팀', value: ['서울'] },
        { key: '장비사업팀', value: ['서울', '파주'] },
        { key: 'ReadOnly', value: ['파주'] },
    ];

    // 날짜를 "yyyy-MM-dd" 형식으로 변환하는 함수
    const formatDate = (dateString) => {
        let month = '' + (dateString.getMonth() + 1),
            day = '' + dateString.getDate(),
            year = dateString.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    };


    const selectSite = () => {
        if (authUserTeam === undefined)
            return;
        const found = Continents.find((item) => item.key === authUserTeam);
        return found ? found.value : undefined;
    }

    const LoadAllBoard = async () => {
        const siteList = selectSite();
        //if (site === undefined) {
        if (!siteList || siteList.length === 0) {
            //console.log('authUserTeam1',authUserTeam);
            alert(`"${authUserTeam}"이름이 서버에 등록된 팀이름과 매칭되지 않아 데이터를 가져올 수 없습니다`, authUserTeam);
            //console.log('authUserTeam2 [',authUserTeam,']');
            return;
        }


        // const mainBoard = await LoadBoard("All", site);
        // if (mainBoard === undefined || mainBoard === '403') {
        //     return [];
        // }
        // //console.log('main', mainBoard);
        // const subBoard = await GetSubLoadBoard("All", site);
        // //console.log('sub', subBoard);
        // const subData = subBoard.data;
        // //console.log('sub', subData);
        // if (subData === undefined) {
        //     return mainBoard;
        // }

        let mainBoard = [];
        let subData = [];

        // 여러 지역 데이터를 순차적으로 가져오기
        for (const site of siteList) {
            const mainBoardData = await LoadBoard("All", site);
            if (mainBoardData && mainBoardData !== '403') {
                mainBoard = [...mainBoard, ...mainBoardData];
            }

            const subBoardData = await GetSubLoadBoard("All", site);
            if (subBoardData && subBoardData.data) {
                subData = [...subData, ...subBoardData.data];
            }
        }

        // 각 targetIndex에 맞는 데이터 항목에 상세 정보를 추가하는 함수
        subData.forEach(detail => {
            // 해당 targetIndex를 가진 객체를 찾습니다.
            let item = mainBoard.find(item => item.Key === detail.FieldNum);
            if (item) {
                // details 속성이 없다면 초기화합니다.
                if (!item.details) {
                    item.details = [JSON.parse(JSON.stringify(item))]; //status 업데이트를 위해 복사해서 초기화함
                }

                // details 배열에 상세 정보를 추가합니다. targetIndex는 제외합니다.
                item.details.push({
                    Index: detail.Index,
                    ProjectName: detail.ProjectName,
                    Date: detail.Date,
                    ChangeDate: detail.ChangeDate,
                    Name: detail.Name,
                    Title: detail.Title,
                    Content: detail.Content,
                    Status: detail.Status,
                    FieldNum: detail.FieldNum,
                    FieldSubNum: detail.FieldSubNum,
                });
                //item.details[0].Status = item.details[item.details.length - 1].Status;
            }
        });

        const sortBoard = mainBoard.sort((a, b) => new Date(b.Date) - new Date(a.Date));

        return sortBoard;
    }

    const UpdateStatus = async (data) => {
        if (data === undefined)
            return;
        let alertTitles = [];
        const today = new Date(); // 기준 날짜는 오늘로 설정
        data = data.map((item) => {
            const itemDate = new Date(item.Date);
            const diffTime = Math.abs(today - itemDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 일 단위로 차이를 계산


            // item.details 배열이 존재하는지 확인 후 모든 항목의 Status를 확인
            const setDay = parseInt(item.Period.replace(/[^0-9]/g, ''), 10);
            const detailsStatuses = item.details ? item.details.map(detail => detail.Status) : [];

            const difference = diffDays - setDay;
            //console.log('itemDate', item.Title, itemDate);
            //console.log('difference 계산 ', difference, diffDays, setDay);
            // 15일 이상 차이가 나고 Status가 '완료' 및 '이슈'가 아닌 경우 '알림'으로 변경

            if (item.details) {
                if (item.details[item.details.length - 1].Status === '완료') {
                    item.Period = '👍';
                } else if (item.details[item.details.length - 1].Status === '이슈') {
                    item.Period = '🚨';
                }
                else {
                    if (difference > 0) {
                        item.Period = `D+${Math.abs(difference)}`;
                    } else if (difference < 0) {
                        item.Period = `${Math.abs(difference)}일`;
                    } else {
                        item.Period = `D-Day`;
                    }
                }
            } else {
                if (item.Status === '완료') {
                    item.Period = '👍';
                } else if (item.Status === '이슈') {
                    item.Period = '🚨';
                } else {
                    if (difference > 0) {
                        item.Period = `D+${Math.abs(difference)}`;
                    } else if (difference < 0) {
                        item.Period = `${Math.abs(difference)}일`;
                    } else {
                        item.Period = `D-Day`;
                    }
                }

            }

            if (
                diffDays > setDay &&
                item.Status !== "완료" &&
                item.Status !== "이슈" &&
                detailsStatuses.every(
                    (status) => status !== "완료" && status !== "이슈"
                )
                // 15일 이상 차이가 나고 Status가 '완료' 및 '이슈'가 아닌 경우 '이슈'로 변경
            ) {
                if (item.details)
                    item.details[item.details.length - 1].Status = "알림";
                else
                    item.Status = "알림";
                alertTitles.push({ title: item.Title, key: item.Key }); // 제목과 키를 alertTitles 배열에 추가
            }
            return item;
        });
        return data;
    }

    const handleData = (data) => {
        //console.log('data', data, data[3]);
        if (data === undefined)
            return;
        setUseSerch(data[0]);
        if (data[1] !== undefined)
            setStartDate(formatDate(data[1]));
        else
            setStartDate(undefined);
        if (data[2] !== undefined)
            setEndDate(formatDate(data[2]));
        else
            setEndDate(undefined);
        if (data[3] !== undefined)
            setProject(data[3]);
        else
            setProject(undefined);
    }

    useEffect(() => {
        const LoadAdminBoard = async () => {
            const data = await LoadAllBoard();
            //console.log('data', data);
            const updata = await UpdateStatus(data);
            if (updata === undefined || updata.length <= 0) {
                return;
            }
            setAllBoard(updata);
        }
        
        if (authUserTeam !== "") {
            LoadAdminBoard();
        }
    }, [isLogged, authUserTeam]);
    


    return (
        <div className="team-todo-list">
            {false && <SearchBar handleData={handleData} useSerch={useSerch} />}
            <AdminBulletin allBoard={allBoard} startDate={startDate} endDate={endDate} project={project} useSerch={useSerch} />
        </div>
    );
};

export default TeamTodoList;