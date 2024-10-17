import { useState, useEffect, useContext } from 'react';
import { Container, Spinner, Alert, ListGroup, Row, Col, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import UserContext from '../context/UserContext';
import UpdatePost from '../components/UpdatePost';
import DeletePost from '../components/DeletePost';

export default function UserProfile() {
    const { user } = useContext(UserContext);
    const [details, setDetails] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPost, setEditingPost] = useState(null);

    const fetchDetails = async () => {
        try {
            const response = await fetch(`https://swiftink.onrender.com/users/details`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const data = await response.json();
            if (data && data.user) {
                setDetails(data.user);
            } else {
                Swal.fire('Error', data.error || 'Something Went Wrong', 'error');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch(`https://swiftink.onrender.com/posts/getOwnPost`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setPosts(data.posts || []);
            } else {
                throw new Error(data.error || "Unable to fetch posts.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchDetails(), fetchPosts()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (!user || user.id === null) {
        return <Navigate to="/" />;
    }

    return (
        <Container className="mt-5 p-5 bg-light text-dark">
            <h1 className="mb-3">Profile</h1>
            {loading && <Spinner animation="border" variant="light" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <>
                    <h2 className="mt-2" >@{details.username}</h2>
                    <h6>Email: {details.email}</h6>
                    <hr />
                    <h4>My Posts</h4>
                    <ListGroup>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <ListGroup.Item key={post._id} className="mb-3">
                                    <Row>
                                        <Col md={4}>
                                            {post.images && post.images.length > 0 && (
                                                <img 
                                                    src={post.images}
                                                    alt={post.title}
                                                    style={{ 
                                                        width: '100%', 
                                                        height: 'auto', 
                                                        maxHeight: '300px', 
                                                        objectFit: 'cover' 
                                                    }} 
                                                />
                                            )}
                                        </Col>
                                        <Col md={8}>
                                            <h5>{post.title}</h5>
                                            <p>{post.content}</p>
                                            Created on: {new Date(post.createdOn).toLocaleDateString()}
                                            <div className="d-flex justify-content-start mt-3">
                                                <Button 
                                                    variant="outline-primary" 
                                                    onClick={() => setEditingPost(post)} 
                                                    style={{
                                                        marginRight: '10px'
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <DeletePost 
                                                    post={post} 
                                                    fetchData={fetchPosts} 
                                                /> 
                                            </div>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item>No posts available.</ListGroup.Item>
                        )}
                    </ListGroup>
                    {editingPost && (
                        <UpdatePost 
                            post={editingPost} 
                            fetchPosts={fetchPosts} 
                            onClose={() => setEditingPost(null)} 
                        />
                    )}
                </>
            )}
        </Container>
    );
}
