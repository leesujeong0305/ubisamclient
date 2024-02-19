import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Personnelinfo from '../Models/PersonInfo'
import { useFooterVisibilityUpdate } from '../Layouts/FooterVisibilityContext';
import './SignUp.css'

function SignUp() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const toggleFooterVisibility = useFooterVisibilityUpdate();

  useEffect(() => {
    setShowModal(true);
    // 페이지가 마운트될 때 Footer를 숨김
    toggleFooterVisibility(false);
    return () => {
      // 페이지가 언마운트될 때 Footer를 다시 표시
      toggleFooterVisibility(true);
    };
  });

  return (
    <>
      <Personnelinfo show={showModal} onHide={() => navigate(-1)} />
    </>
  )
}

export default SignUp
