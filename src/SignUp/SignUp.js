import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Personnelinfo from '../Models/PersonInfo'


function SignUp() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowModal(true);
  })
  return (
    <>
    <div>회원가입창입니다.</div>
      <Personnelinfo show={showModal} onHide={() => navigate(-1)} />
    </>
  )
}

export default SignUp
