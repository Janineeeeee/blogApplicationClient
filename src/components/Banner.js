import './styles/Banner.css'; 
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

export default function Banner() {
  const { user } = useContext(UserContext);

  if (user && user.id && !user.isAdmin) {
    return (
      <div className="banner">
        <h1>Welcome to Swift Ink</h1>
        <p>Your go-to blog for creative inspiration!</p>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="banner">
        <h1>Unlock Your Creativity!</h1>
        <p>Join us for inspiring content and connect with fellow creators.</p>
        <h6>
          <Link to="/login" className="banner-link">Login</Link> or <Link to="/register" className="banner-link">Register</Link> to get started!
        </h6>
      </div>
    );
  }
  return null;
}
