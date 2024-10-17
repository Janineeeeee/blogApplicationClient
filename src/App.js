import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { jwtDecode } from 'jwt-decode';
import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import './App.css';


function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  const unsetUser  = () => {
    localStorage.clear();
  };

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`https://swiftink.onrender.com/users/details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
           console.log(data);
          if (data.auth !== "Failed") {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin
            });
          } else {
            unsetUser();
          }
        })
        .catch(error => {
          console.error(error);
          unsetUser();
        });
      } else {
        unsetUser();
      }
    }, []);

    useEffect(()=> {
    console.log(user);
    console.log(localStorage);
  }, [user])
  return (
    <div className="wrapper">
        <UserProvider value={{ user, setUser, unsetUser  }}>
          <Router>
            <AppNavbar/>
            <Container className="content">
              <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/userProfile" element={<UserProfile />} />
                <Route path="/adminProfile" element={<AdminProfile />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/logout" element={<Logout />}/>
              </Routes>
            </Container>
            <Footer/>
          </Router> 
        </UserProvider>
      </div>
  );
}

export default App;
