import React, { useEffect, useState } from 'react';
import SearchBar from './TeamTodoList/SearchBar';
import AdminBulletin from './TeamTodoList/AdminBulletin';
import SelectItems from '../../MyCalendar/SelectItems';
import { useSelector } from 'react-redux';
import LoadBoard from '../../../Board/Page/LoadBoard';
import GetSubLoadBoard from '../../../API/GetSubLoadBoard';

const TeamTodoList = () => {
    const isLogged = useSelector(state => state.auth.isLoggedIn);
    const [allBoard, setAllBoard] = useState([])
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [project, setProject] = useState(null);
    const [useSerch, setUseSerch] = useState(false);
    const [tabs, setTabs] = useState([])

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

    const LoadAllBoard = async () => {
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
                    if (item.details[0].Status === '완료') {
                        item.Period = '👍';
                    } else if (item.details[0].Status === '이슈') {
                        item.Period = '🚨';
                    }
                    else {
                        if (difference > 0) {
                            item.Period = `D-${Math.abs(difference)}`;
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
                            item.Period = `D-${Math.abs(difference)}`;
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
                    item.Status = "알림";
                    alertTitles.push({ title: item.Title, key: item.Key }); // 제목과 키를 alertTitles 배열에 추가
                }
                return item;
            });
            return data;
        }

        const mainBoard = await LoadBoard("All");
        //console.log('main', mainBoard);
        const subBoard = await GetSubLoadBoard("All");
        //console.log('sub', subBoard);
        const subData = subBoard.data;
        //console.log('sub', subData);
        if (subData === undefined) {
            return mainBoard;
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
                item.details[0].Status = item.details[item.details.length - 1].Status;
            }
        });
        const data = await UpdateStatus(mainBoard);
        return mainBoard;
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
                if (item.details[0].Status === '완료') {
                    item.Period = '👍';
                } else if (item.details[0].Status === '이슈') {
                    item.Period = '🚨';
                }
                else {
                    if (difference > 0) {
                        item.Period = `D-${Math.abs(difference)}`;
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
                        item.Period = `D-${Math.abs(difference)}`;
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
                    item.details[0].Status = "알림";
                else
                    item.Status = "알림";
                alertTitles.push({ title: item.Title, key: item.Key }); // 제목과 키를 alertTitles 배열에 추가
            }
            return item;
        });
        return data;
    }

    const handleData = (data) => {
        console.log('data', data, data[3]);
        if (data === undefined)
            return;
        setUseSerch(data[0]);
        setStartDate(formatDate(data[1]));
        setEndDate(formatDate(data[2]));
        setProject(data[3]);
    }

    useEffect(() => {
        const LoadAdminBoard = async () => {
            // console.log('loadData');
            //const loadData = await AdminBoard();
            const data = await LoadAllBoard();
            const updata = await UpdateStatus(data);
            const tabs = ['전체', ...new Set(updata.map(item => item.ProjectName))]; // 중복 제거하여 탭 생성
            setTabs(tabs);
            // console.log('loadData', updata);
            setAllBoard(updata);
        }

        LoadAdminBoard();
    }, [isLogged])


    return (
        <div className="team-todo-list">
            <SearchBar handleData={handleData} tabs={tabs} />
            <AdminBulletin allBoard={allBoard} startDate={startDate} endDate={endDate} project={project} useSerch={useSerch} />
        </div>
    );
};

export default TeamTodoList;