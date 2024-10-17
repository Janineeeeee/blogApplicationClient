import { useState, useEffect, useContext } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import UserContext from '../context/UserContext';

export default function AdminProfile() {
    const { user } = useContext(UserContext);
    const [details, setDetails] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`https://swiftink.onrender.com/users/details`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const data = await response.json();

                if (data && data.user) {
                    setDetails(data.user);
                } else {
                    Swal.fire('Error', data.error || 'User not found', 'error');
                }
            } catch (err) {
                Swal.fire('Error', err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    if (!user || user.id === null) {
        return <Navigate to="/" />;
    }

    return (
        <Container className="mt-5 p-5 bg-light text-dark">
            <h1 className="mb-3">Profile</h1>
            {loading && <Spinner animation="border" variant="light" />}
            {!loading && (
                <>
                    <h2 className="mt-2">{details.username}</h2>
                    <h6>Email: {details.email}</h6>
                </>
            )}
        </Container>
    );
}
