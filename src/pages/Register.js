import { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';

export default function Register() {
  const { user } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(false);

  const registerUser = (e) => {
    e.preventDefault();

    fetch(`https://swiftink.onrender.com/users/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        username,
        password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Registered Successfully") {
          setEmail('');
          setUsername('');
          setPassword('');
          setConfirmPassword('');

          Swal.fire({
            title: "Registration Successful",
            icon: "success",
            text: "Thank you for registering!"
          });
        } else {
          Swal.fire({
            title: "Something went wrong.",
            icon: "error",
            text: "Please try again later or contact us for assistance"
          });
        }
      });
  };

  useEffect(() => {
    if (email !== "" && username !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, username, password, confirmPassword]);

  return (
    <Container className="mt-3 text-center">
      {user.id !== null ? <Navigate to="/" /> : (
        <Card className="w-100" style={{ maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f3f4f6' }}>
          <Card.Body>
            <Card.Title>Register</Card.Title>
            <Form onSubmit={registerUser}>
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

              <Form.Group controlId="username" className="my-4 text-start">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

              <Form.Group controlId="confirmPassword" className="my-4 text-start">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Button className="w-50 my-3" variant={isActive ? "dark" : "secondary"} type="submit" disabled={!isActive}>
                Register
              </Button>
              <p className="mt-3">
                Already have an account? <Link to="/login">Login Now</Link>
              </p>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}


