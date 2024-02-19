import React, { useState } from 'react'
import './Main.css'
import { Link } from 'react-router-dom'

export default function MainUI() {
  return (
    <>
      <section id="top">
        <div className="section-content overlay d-flex justify-content-center align-items-center">
          <div className="container-xxl">
            <div className="row align-items-center">
              <div className="col-md-9 welcome" style={{ marginLeft: '00px' }}>
                <h1 className="welcome-title fw-light"><span className="text-warning fw-bold">오늘도 수고 많으셨습니다.</span></h1>
                <div className="row welcome-desc">
                  <p className="col-sm-10 col-md-12 lead"> 여기에 하루 일과를 정리 하시길 바랍니다.</p>
                </div>
              </div>
              <div className="col-md-4 d-none d-md-block letsgo" style={{ marginLeft: '-200px' }}>
                <div className="card card-body letsgo-card">
                  <div className="letsgo my-3" style={{
                    display: 'flex', justifyContent: 'center',
                    alignItems: 'center', fontSize: '24px', fontWeight: 'bold'
                  }}>로그인</div>
                  <div className="letsgo-card-form">
                    <form>
                      <div className="mb-4">
                        <div className='mb-2' style={{ color: 'black' }}>아이디</div>
                        <input type="text" className="form-control" placeholder='Your name'></input>
                      </div>
                      <div className="mb-4">
                        <div className='mb-2' style={{ color: 'black' }}>이메일</div>
                        <input type="tel" className="form-control" placeholder='Your email'></input>
                      </div>
                      <Link to={'/Signup'} style={{ display: 'flex', justifyContent: 'right', textDecoration: 'none', marginRight: '20px' }}>회원가입</Link>
                      <Link to={'/Board'}>내용추가(임시)</Link>
                      <p />
                      <p className="mb-3">
                        <button className='btn btn-primary w-100' type='buttn'>로그인</button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
