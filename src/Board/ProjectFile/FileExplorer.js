
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import './FileExplorer.css'
import Axios from '../../API/AxiosApi';

function FileItem({ name, created, size, selectedProjectName, succ, setSucc }) {
    

    const handleDownloadFile = (filename) => {
        const url = `http://192.168.0.202:8877/download/${encodeURIComponent(filename)}?Project=${encodeURIComponent(selectedProjectName)}`;
    
        // Axios를 사용하여 파일을 다운로드하는 GET 요청을 보냅니다.
        // `responseType: 'blob'`을 설정하여 파일 데이터를 Blob 형태로 받습니다.
        Axios.get(url, { responseType: 'blob' })
            .then((response) => {
                // Blob 데이터와 함께 클라이언트에서 파일을 다운로드합니다.
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename); // 다운로드할 파일 이름 설정
                document.body.appendChild(link);
                link.click();
                
                // 다운로드 이후에 링크 요소를 정리합니다.
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);  // 생성된 URL을 정리합니다.
            })
            .catch((error) => console.log(error));
    }

    const handleDeleteFile = (filename) => {
        Axios.delete(`http://192.168.0.202:8877/deleteFile/${encodeURIComponent(filename)}?Project=${encodeURIComponent(selectedProjectName)}`)
        .then((response) => {
            console.log(response.data.message);
            // 여기에서 UI 업데이트 로직을 추가할 수 있습니다. 예를 들어, 삭제된 파일을 목록에서 제거할 수 있습니다.
            setSucc(true);
        })
        .catch((error) => console.log(error));
    }

    return (
        <div className="file-item">
            <span className="file-name">{name}</span>
            <span className="file-created">{created}</span>
            {/* <span className="file-size">{size}</span> */}
            <div className="file-actions">
                {/* <button onClick={() => console.log('Viewing', name)}>🔍</button> */}
                <button onClick={() => handleDownloadFile(name)}>📤</button>
                {/* {type === 'file' && <button onClick={() => console.log('Uploading', name)}>✏️</button>} */}
                <button onClick={() => handleDeleteFile(name)}>🗑️</button>
            </div>
        </div>
    );
}

function FileExplorer({ selectedProjectName }) {
    const [items, setItems] = useState([]); // Initialize the items state
    const fileInputRef = useRef();
    const [projectName, setProjectName] = useState('');
    const [succ, setSucc] = useState(false);

    useEffect(() => {
        if (selectedProjectName === "No Data")
            return;
        setProjectName(selectedProjectName);
        Load();
    }, [selectedProjectName])

    useEffect(() => {
        console.log(succ);
        setItems([]);
        Load();
        setSucc(false);
    }, [succ]);

    const handleAddItem = () => {
        // Reset the value of the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        // Open the file dialog
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Assuming you have a function to upload the file
            await uploadFile(file);
        }
    };

    const Load = async () => {
        const res = await LoadFiles();
        //console.log('Load', res);

        if (res === undefined) {
            alert(`프로젝트 데이터가 없습니다.`);
            return;
        } 
        ////왜 accessToken을 가져오지?
        const newItems = res.map((item, index) => ({
            key: index,
            name: item.filename,
            created: item.datetime,
            size: `${item.size} bytes`,
        }));

        console.log(newItems);
        //새 항목으로 아이템 상태를 업데이트합니다.
        setItems(newItems);
    };

    const LoadFiles = async () => {
        try {
            const response = await Axios.get(`http://192.168.0.202:8877/getFile?Project=${encodeURIComponent(selectedProjectName)}`);
            return response.data;
            setItems(response.data); // 가져온 데이터로 상태 업데이트


        } catch (error) {
            console.error('데이터 로딩 중 에러 발생:', error);
        }
    };

    // Simulate uploading file to the server and updating the list
    const uploadFile = async (file) => {
        console.log('파일 업로드 중:', file.name);

        // 파일 데이터를 보낼 FormData 인스턴스 생성
        const formData = new FormData();
        formData.append('file', file); // 'file' 키는 서버에서 파일 업로드 필드로 예상하는 키와 일치해야 합니다.

        const fileDate = new Date(file.lastModified);

        // ISO 문자열로 변환 (예: "2024-03-26T16:55:20.000Z")
        const isoString = fileDate.toISOString();

        // ISO 문자열을 원하는 'YYYY-MM-DD HH:MM:SS' 형식으로 변환
        // 'T'를 기준으로 날짜와 시간을 분리하고, 'Z' (UTC 지정자)를 무시합니다.
        const [date, time] = isoString.split('T');
        const formattedTime = time.split('.')[0]; // '.000Z' 부분 제거
        const dateTime = `${date} ${formattedTime}`;

        console.log('Formatted dateTime:', dateTime);
        console.log('file', dateTime);
        try {
            // fetch API를 사용하여 서버로 파일을 보냅니다.
            const response = await Axios.post(`http://192.168.0.202:8877/uploadFile?Project=${encodeURIComponent(projectName)}&dateTime=${encodeURIComponent(dateTime)}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // 이 행을 제거하거나 자동으로 설정되게 둡니다.
                }
            });
            // console.log(response);
            if (response.statusText === 'OK') {
                console.log("성공", response.data);
            }
            else {
                throw new Error(`서버 응답 ${response.status}: ${response.statusText}`);
            }

            // 필요한 경우 로컬 상태를 업데이트하여 업로드를 반영합니다.
            const newItem = {
                name: file.name,
                created: dateTime,
                size: `${file.size} bytes`,
            };

            // 새 항목으로 아이템 상태를 업데이트합니다.
            setItems(prevItems => [...prevItems, newItem]);
        } catch (error) {
            console.error('파일 업로드 중 에러 발생:', error);
        }
    };

    return (
        <div className="file-explorer">
            <div className="file-explorer-header">
                <h2 className="file-explorer-title">프로젝트 파일 공유</h2>
                <button className="add-button" onClick={handleAddItem}>➕</button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
           application/vnd.ms-excel,
           application/vnd.openxmlformats-officedocument.presentationml.presentation,
           application/vnd.ms-powerpoint,
           application/vnd.openxmlformats-officedocument.wordprocessingml.document,
           application/msword,
           text/plain,
           .log,
           application/pdf,
           text/csv
         "
                />
            </div>
            {items.map((item, index) => (
                // <FileItem key={index} {...item} />
                <FileItem key={index} {...item} selectedProjectName={selectedProjectName} succ={succ} setSucc={setSucc} />
            ))}
        </div>
    );
}

export default FileExplorer;