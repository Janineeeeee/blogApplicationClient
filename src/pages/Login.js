import { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';

export default function Login() {
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState(''); 
  const [isActive, setIsActive] = useState(true);

function authenticate(e) {
    e.preventDefault();
    
    fetch(`https://swiftink.onrender.com/users/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.access !== undefined) {

        localStorage.setItem('token', data.access);
        retrieveUserDetails(data.access); 

        Swal.fire({
          title: "Login Successful",
          icon: "success",
          text: "Welcome to Swift Ink"
        });

        setEmail('');
        setPassword('');

      } else {
        Swal.fire({
          title: "Authentication failed",
          icon: "error",
          text: "Check your login details and try again."
        });
      }
    });
  };

  function retrieveUserDetails(token){
    fetch(`https://swiftink.onrender.com/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setUser({
        id: data.user._id,
        isAdmin: data.user.isAdmin
      });
    });
  };

  useEffect(() => {

    if (email !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

    return (
        <Container className="mt-3 text-center">
                    {user.id !== null ? (
                        <Navigate to="/" />
                    ) : (
                        <Card className="w-100" style={{ maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f3f4f6' }}>
                            <Card.Body>
                                <Card.Title>Login</Card.Title>
                                <Form onSubmit={authenticate}>
                                    <Form.Group controlId="email" className="my-4 text-start">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="password" className="my-4 text-start">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Button className="w-50 my-2" variant={isActive ? "dark" : "secondary"} type="submit" disabled={!isActive}>
                                        Login
                                    </Button>

                                    <p className="mt-3">
                                        Don't have an account? <Link to="/register">Register Now</Link>
                                    </p>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}
        </Container>
    );
}
