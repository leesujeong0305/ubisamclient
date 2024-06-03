import React, { useEffect, useState } from 'react'
import './ViewGitHistory.css'
import { GitHistory } from '../../API/GitHistory';
import { UpdateGitURL } from '../../API/UpdateGitURL';
import { GetProjectInfo } from '../../API/GetProjectInfo';
import { UpdateGitPage } from '../../API/UpdateGitPage';

function ViewGitHistory({ selectedProjectName }) {
    const [path, setPath] = useState('');
    const [history, setHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(0);  // 0 : 초기, 1: 연결 중, 2: 성공시, 3: 실패시
    const [isShow, setIsShow] = useState(false);
    const [firstLoad, setFirstLoad] = useState(false);
    const [pagePath, setPagePath] = useState('');

    const handleInputChange = (event) => {
        // 입력 필드의 값을 올바르게 설정
        setPath(event.target.value);
    };

    const handlePathChange = (event) => {
        setPagePath(event.target.value);
    }

    const handleGitConn = async () => {
        
        if (path === '') {
            return;
        }

        setIsLoading(1);
        const res = await GitHistory(path);
        if (res.result === 'SUCCESS') {
            setHistory(res.commitLog);
        console.log('res', res);
        setTimeout(() => {
            if (res.commitLog.length > 0) {
                setIsLoading(2);
            }
        }, 1000); // 2초 지연
        } else {
            setIsLoading(3);
        }
    };

    const handleGitSave = async () => {
        if (path === '' || path === undefined) {
            return;
        }

        if (window.confirm('현재 Path로 저장하시겠습니까?')) {
            await UpdateGitURL(path, selectedProjectName);
        }
    };

    

    const truncateMessage = (message, maxLength) => {
        if (message.length > maxLength) {
            return message.slice(0, maxLength) + '...';
        }
        return message;
    }

    const handleGitPageLoad = () => {
        if (pagePath) {
            window.open(pagePath, '_blank', 'noopener,noreferrer');
          }
    }

    const handleGitPageSave = () => {
        if (pagePath === '' || pagePath === undefined) {
            return;
        }

        if (window.confirm('현재 Path로 저장하시겠습니까?')) {
            UpdateGitPage(path, selectedProjectName);
        }
    }

    useEffect(() => {
        setIsLoading(0);
        setPath('');
        setPagePath('');

        const initStart = async () => {
            const info = await GetProjectInfo(selectedProjectName);
            if (info[0].GitURL === null) {
                setPath('');
            } else {
                setPath(info[0].GitURL);
                setFirstLoad(true);
            }

            if (info[0].GitPageURL === null) {
                setPagePath('');
            } else {
                setPagePath(info[0].GitPageURL);
            }
            
            if (selectedProjectName.includes(' CS')) {
                setIsShow(false);
            } else {
                setIsShow(true);
            }
        }
        if (selectedProjectName !== 'No Data') {
            initStart();
        }
        
    }, [selectedProjectName])

    useEffect(() => {
        if (firstLoad === true) {
            handleGitConn();
        }
        setFirstLoad(false);
    }, [firstLoad])

    return (
        <>
        <div className="git-container mb-1">
            <div className="git-container-page-header">
                <div>Git 페이지 이동</div>
                <input className='git-page-path ms-1 me-1' type="text" placeholder='프로젝트 Git 페이지 주소 입력'
                    value={pagePath} onChange={handlePathChange}></input>
                <div className='button-container'>
                    <button className="conn-button me-1" onClick={handleGitPageLoad}>🌐이동</button>
                    {
                        isShow === true ? (
                            <button className="conn-button" onClick={handleGitPageSave}>💾저장</button>
                        ) : (<div></div>)
                    }
                </div>

            </div>
        </div>
        <div className="git-container">
            
            <div className="git-container-header">
                <div>Git History</div>
                <input className='git-path ms-1 me-1' type="text" placeholder='프로젝트 Git주소 입력'
                    value={path} onChange={handleInputChange}></input>
                <div className='button-container'>
                    <button className="conn-button me-1" onClick={handleGitConn}>🔗연결</button>
                    {
                        isShow === true ? (
                            <button className="conn-button" onClick={handleGitSave}>💾저장</button>
                        ) : (<div></div>)
                    }
                </div>

            </div>
            <div className='git-container-body'>
                {
                isLoading === 0 ? (
                    <div>Git History를 불러와주세요</div>
                   ) : isLoading === 1 ? (
                    <div>연결 중</div>
                   ) : isLoading === 2 ? (
                        history && history.length > 0 && (
                            history.map((item, index) => {
                                const extractedDate = item.date.split('T')[0];
                                const truncatedMessage = truncateMessage(item.message, 100); // 원하는 길이로 조절
                                return (
                                    <div key={index} className='git-list col'>
                                        <div>{item.message}</div>
                                        <div className='git-list-name row'>
                                            <div>{item.author_name}</div>
                                            <div>{extractedDate}</div>
                                        </div>
                                    </div>
                                )
                            })

                        ) 
                    ) : (
                            <p>Git Conn Fail. 관리자에게 문의해주세요</p>
                        )
                    
                }
            </div>
        </div>
        </>
    )
}

export default ViewGitHistory