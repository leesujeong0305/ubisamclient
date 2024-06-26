import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { GetProjectInfo } from '../../API/GetProjectInfo';
import { DataGrid } from '@mui/x-data-grid';
import { Box, FormControl, MenuItem, Select, TextField, Button, InputLabel } from '@mui/material';
import { AddProjectInfo } from '../../API/AddProjectInfo';


export default function AdminPage() {
  const dispatch = useDispatch();
  const isLogged = useSelector(state => state.auth.isLoggedIn);
  const {authUserId, authUserName, authUserRank} = useSelector(state => state.userInfo);

  const [rows, setRows] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectPeriod, setProjectPeriod] = useState("");
  const [projectUsers, setProjectUsers] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectPM, setProjectPM] = useState("");
  const [projectSite, setProjectSite] = useState("");

  const LoadAllProjectInfo = async () => {
    const data = await GetProjectInfo("All");
    if (data === undefined)
      return;
    const dataWithIds = data.map((item, index) => ({
      id: index + 1, // id 필드 추가, 1부터 시작하는 고유한 값
      ...item
    }));
    setRows(dataWithIds);
  }

  const handleStatusChange = (event, params) => {
    const updatedRows = rows.map((row) => {
      if (row.id === params.id) {
        return { ...row, Status: event.target.value }; //Status만 업데이트
      }
      return row;
    });
    setRows(updatedRows); // 상태 업데이트
  };

  const handleSiteChange = (event, params) => {
    const updatedRows = rows.map((row) => {
      if (row.id === params.id) {
        return { ...row, Site: event.target.value };
      }
      return row;
    });
    setRows(updatedRows); // 상태 업데이트
  }

  useEffect(() => {
    if (isLogged === true) {
    LoadAllProjectInfo();
    }
  }, [isLogged])

  const columns = [
    { field: 'ProjectName', headerName: 'Project', width: 300, editable: false},
    { field: 'Period', headerName: 'Period', width: 130, editable: true },
    { field: 'Users', headerName: 'Users', width: 500, editable: true },
    {
      field: 'Status',
      headerName: '프로젝트 상태',
      width: 100,
      editable: true,
      renderCell: (params) => (
        <FormControl sx={{ Height: 10}}>
          <Select
          value={params.value}
          onChange={(event) => handleStatusChange(event, params)}
          sx={{height: '50%'}} // 드롭다운 너비 조정
          inputProps={{ sx: { height: '90%' } }} // 내부 요소 스타일 조정
        >
          <MenuItem value="0">대기</MenuItem>
          <MenuItem value="1">제작</MenuItem>
          <MenuItem value="2">셋업</MenuItem>
          <MenuItem value="3">완료</MenuItem>
        </Select>
        </FormControl>
        
      )
    },
    //{ field: 'Status', headerName: '프로젝트 상태', width: 100 },
    { field: 'PM', headerName: 'PM', width: 100, editable: true },
    {
      field: 'Site',
      headerName: 'Site',
      width: 100,
      editable: false,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(event) => handleSiteChange(event, params)}
          fullWidth
        >
          <MenuItem value="파주">파주</MenuItem>
          <MenuItem value="구미">구미</MenuItem>
        </Select>
      )
    },
    {
      field: 'Edit',
      headerName: '수정',
      renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        startIcon={"📝"}
        onClick={() => handleEditClick(params)}
      >
        Edit
      </Button>
    )
    }
  ];

  const handleAddRow = async () => {
    if (projectName && projectPeriod && projectUsers && projectSite) {
      const newRow = {
        id: rows.length ? rows[rows.length - 1].id + 1 : 1, // 새로운 행의 ID 설정
        Project: projectName,
        Period: projectPeriod, // 나이를 숫자로 변환
        Users: projectUsers,
        Status: projectStatus,
        PM: projectPM,
        Site: projectSite,
      };
      await AddProjectInfo(newRow);


      setRows([...rows, newRow]);
      setProjectName('');
      setProjectPeriod('');
      setProjectUsers('');
      setProjectStatus('');
      setProjectPM('');
      setProjectSite('');
    }
  };

  const handleEditClick = (params) => {
    console.log('edit', params);
    // setEditRowsModel({
    //   ...editRowsModel,
    //   [params.id]: {
    //     name: { value: params.row.name, error: false },
    //     age: { value: params.row.age, error: false },
    //     job: { value: params.row.job, error: false }
    //   }
    // });
  };

  return (
    <div>

      <div className='ms-1 me-1'>
      <Box sx={{height: 500 ,width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick //DataGrid 컴포넌트에서 셀을 클릭했을 때 해당 셀이 선택되지 않도록 하는 설정
        experimentalFeatures={{ newEditingApi: true }} //새로운 편집 API를 활성화하여 보다 강력한 편집 기능을 제공
      />
    </Box>
    <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Project"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <TextField
          label="Period"
          value={projectPeriod}
          onChange={(e) => setProjectPeriod(e.target.value)}
        />
        <TextField
          label="Users"
          value={projectUsers}
          onChange={(e) => setProjectUsers(e.target.value)}
        />
        {/* <TextField
          label="프로젝트 상태"
          value={projectStatus}
          onChange={(e) => setProjectStatus(e.target.value)}
        /> */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>프로젝트 상태</InputLabel>
          <Select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}
            label="프로젝트 상태">
              <MenuItem value="0">대기</MenuItem>
            <MenuItem value="1">제작</MenuItem>
            <MenuItem value="2">셋업</MenuItem>
            <MenuItem value="3">완료</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="PM"
          value={projectPM}
          onChange={(e) => setProjectPM(e.target.value)}
        />
        {/* <TextField
          label="Site"
          value={projectSite}
          onChange={(e) => setProjectSite(e.target.value)}
        /> */}
        <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Site</InputLabel>
        <Select
          value={projectSite}
          onChange={(e) => setProjectSite(e.target.value)}
        >
          <MenuItem value="파주">파주</MenuItem>
          <MenuItem value="구미">구미</MenuItem>
        </Select>
        </FormControl>
        <Button variant="contained" onClick={handleAddRow}>
          Add Row
        </Button>
      </Box>
      </div>
      
    </div>
  )
}
