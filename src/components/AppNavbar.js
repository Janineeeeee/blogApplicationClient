import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" fixed="top" style={{backgroundColor: '#DEBBA3'}}>
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="fw-bold text-dark">Swift Ink</Navbar.Brand>
                <Navbar.Toggle 
                    aria-controls="basic-navbar-nav" 
                    className="border-0 bg-white"
                >
                    <span className="navbar-toggler-icon bg-white"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" className="mx-2 text-dark">Home</Nav.Link>

                        {(user.id !== null) ? (
                            user.isAdmin === true ? (
                              <>
                              <Nav.Link as={NavLink} to="/adminProfile" className="mx-2 text-dark">Admin Profile</Nav.Link>
                                <Nav.Link as={NavLink} to="/logout" className="mx-2 text-dark">Logout</Nav.Link>
                              </>
                            )  :  (
                              <>
                                <Nav.Link as={NavLink} to="/userProfile" className="mx-2 text-dark">My Profile</Nav.Link>
                                <Nav.Link as={NavLink} to="/logout" className="mx-2 text-dark">Logout</Nav.Link>
                              </>
                            )
                        )   : (
                            <>
                                <Nav.Link as={NavLink} to="/login" className="mx-2 text-dark">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register" className="mx-2 text-dark">Register</Nav.Link>
                            </>
                          )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
