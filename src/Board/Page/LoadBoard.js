import Axios from '../../API/AxiosApi';

function LoadBoard(name) {
    const ip = process.env.REACT_APP_API_DEV === 1 ? `http://localhost:8877` : `http://14.58.108.70:8877`;
    return Axios.post(`${ip}/Board`, {
        projectName: name, // 나중에 변경
    }, {
        headers: {
            "Content-Type": "application/json",
        }
    }).then(response => {
        if (response.status === 200) {
            
            const newDataRow = response.data.data.map((item, index) => ({
                Key: item.Index,
                Index: index + 1, // 예시로 index 사용, 실제 구현에서는 서버로부터의 데이터에 따라 조정
                ProjectName: item.ProjectName, // 서버로부터 받은 데이터 구조에 따라 접근
                Date: item.Date, // 예시 날짜, 실제로는 동적으로 설정
                ChangeDate: item.ChangeDate,
                Name: item.Name, // 서버로부터 받은 데이터 구조에 따라 접근
                Title: item.Title, // 서버로부터 받은 데이터 구조에 따라 접근
                Content: item.Content, // 서버로부터 받은 데이터 구조에 따라 접근
                Status: item.Status, // 서버로부터 받은 데이터 구조에 따라 접근
                Plus: item.Plus
            }));

        //         // 데이터 그룹화 및 병합
        // const groupedData = response.data.data.reduce((acc, item, index) => {
        //     if (acc[item.Title]) {
        //         acc[item.Title].Content += '[ToDoList]' + item.Content; // Content 결합
        //     } else {
        //         acc[item.Title] = { ...item, 
        //             Key: item.Index,
        //             Index: index + 1, 
        //             ProjectName: item.ProjectName, 
        //             Date: item.Date, 
        //             ChangeDate: item.ChangeDate, 
        //             Name: item.Name, 
        //             Title: item.Title, 
        //             Content: item.Content,
        //             FieldIndex: item.FieldIndex,
        //         };
        //     }
        //     return acc;
        // }, {});

        // 데이터를 Index 값으로 매핑
        // const dataByKey = response.data.data.reduce((acc, item, index) => {
        //     acc[item.index] = { ...item,
        //         Key: item.Index,
        //         Index: index + 1, 
        //         ProjectName: item.ProjectName, 
        //         Date: item.Date, 
        //         ChangeDate: item.ChangeDate, 
        //         Name: item.Name, 
        //         Title: item.Title, 
        //         Content: item.Content,
        //         FieldIndex: item.FieldIndex, };
        //     return acc;
        // }, {});

        // Plus 값으로 Content 결합
        // Object.values(dataByKey).forEach(item => {
        //     if (item.FieldIndex !== 'null' && dataByKey[item.FieldIndex]) {
        //         dataByKey[item.FieldIndex].Content += ' ' + item.Content;
        //     }
        // });
        // 배열로 변환하고 필요 없는 항목 제거
        //const finalData = Object.values(dataByKey);//.filter(item => item.Plus === 'null');


            // 배열로 변환
            //const mergedContentArray = Object.values(groupedData);

            const sortedData = newDataRow.sort((a, b) => new Date(b.Index) - new Date(a.Index)); //최신부터 보여줌
            return sortedData;

        } else if (response.data.code === 403) { //에러메세지 로그 없이 처리하려할때
            console.log("403");
            return '403';
        }
    }).catch(error => {
        //console.log({error});
        if (error.response.status === 403) {
            alert(`${error.response.data.message}`);
        }
        return '403';
    });
}

export default LoadBoard
