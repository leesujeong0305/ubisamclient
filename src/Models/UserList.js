import React, {useState} from 'react'
import Personnelinfo from '../Models/PersonInfo';


function UserList() {
    const [personInfo, setPersonInfo] = useState(false);

    const handleClose = () => setPersonInfo(false);
    const handleShow = () => setPersonInfo(true);
  return (
    <>
    <Personnelinfo show={personInfo} onHide={() => setPersonInfo} />
      <button onClick={handleShow}>추가</button>
    </>
  )
}

export default UserList
