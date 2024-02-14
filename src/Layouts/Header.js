import React from 'react'
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { BsRss } from "react-icons/bs";


const Header = () => {

  return (
    <>
      <header>
        <Navbar bg="light" expand="lg">
          <Container>
          
            <Navbar.Brand href="/">Ubisam.com < BsRss style ={{ backgroundColor: "skyblue" }} /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {/* 여기서 왼쪽 정렬 */}
              <Nav className="ms-auto">
                <Nav.Link href="/company/contact">
                  {/* <Button variant="secondary">비상 연락망</Button> */}
                  <Button variant="secondary">
                    로그인
                  </Button>
                </Nav.Link>
                {/* <Nav.Link href="/company/contact">Link</Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header