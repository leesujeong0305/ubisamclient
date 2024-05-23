import React, { useEffect, useState } from 'react'
import './ViewGitHistory.css'
import { GitHistory } from '../../API/GitHistory';
import { UpdateGitURL } from '../../API/UpdateGitURL';
import { GetProjectInfo } from '../../API/GetProjectInfo';

function ViewGitHistory({ selectedProjectName }) {
    const [path, setPath] = useState('');
    const [history, setHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(0);  // 0 : 초기, 1: 연결 중, 2: 성공시, 3: 실패시
    const [isShow, setIsShow] = useState(false);

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
                console.log('2초 후');
                setIsLoading(2);
            }
        }, 2000); // 2초 지연
        } else {
            setIsLoading(3);
        }
    };

    const handleGitSave = async () => {
        if (path === '') {
            return;
        }

        if (window.confirm('현재 Path로 저장하시겠습니까?')) {
            await UpdateGitURL(path, selectedProjectName);
        }
};

    const handleInputChange = (event) => {
        // 입력 필드의 값을 올바르게 설정
        setPath(event.target.value);
    };

    useEffect(() => {
        setIsLoading(0);
        setPath('');

        const initStart = async () => {
            const info = await GetProjectInfo(selectedProjectName);
            if (info[0].GitURL !== undefined) {
                setPath(info[0].GitURL);
            } else {
                setPath('');
            }
            
            if (selectedProjectName.includes('CS')) {
                setIsShow(false);
            } else {
                setIsShow(true);
            }
        }
        if (selectedProjectName !== 'No Data') {
            initStart();
        }
        
    }, [selectedProjectName])

    return (
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
                            <p>Git Conn Fail. OpenVPN이 켜져있는지 확인해주세요</p>
                        )
                    
                }
            </div>
        </div>
    )
}

export default ViewGitHistory