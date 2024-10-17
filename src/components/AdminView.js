import { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import DeletePost from './DeletePost';
import ViewComments from './ViewComments'; 

export default function AdminView({ postData, fetchPosts }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    useEffect(() => {
        console.log(postData);
    }, [postData]);

    const handleOpenModal = (postId) => {
        setSelectedPostId(postId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPostId(null);
    };

    const handleCommentDeleted = (commentId) => {
        console.log(`Comment deleted: ${commentId}`);
    };

    return (
        <div className="my-4">
            <h1 className="text-center">Admin Dashboard</h1>
            <Row xs={1} md={2} lg={3} className="g-4">
                {postData.length > 0 ? (
                    postData.map(post => (
                        <Col key={post._id}>
                            <Card>
                                <Row>
                                    {post.images && post.images.length > 0 && (
                                        <Col md={4}>
                                            <Card.Img 
                                                variant="top" 
                                                src={post.images} 
                                                alt="Post Image" 
                                                style={{ 
                                                    width: '100%', 
                                                    height: 'auto', 
                                                    maxHeight: '300px',
                                                    objectFit: 'cover' 
                                                }} 
                                            />
                                        </Col>
                                    )}
                                    <Col md={8}>
                                        <Card.Body>
                                            <div className="d-flex align-items-center mb-2">
                                                <Card.Subtitle className="mb-0 text-muted">@{post.username}</Card.Subtitle>
                                            </div>
                                            <Card.Title>{post.title}</Card.Title>
                                            <Card.Text>
                                                {post.content}
                                            </Card.Text>
                                            <Card.Footer className="text-muted">
                                                Created On: {new Date(post.createdOn).toLocaleDateString()}
                                            </Card.Footer>
                                            <div className="d-flex justify-content-between mt-3">
                                                <Button 
                                                    variant="outline-info" 
                                                    className="flex-grow-1 me-2"
                                                    size="sm"
                                                    onClick={() => handleOpenModal(post._id)}
                                                >
                                                    View Comments
                                                </Button>
                                                <DeletePost 
                                                    post={post} 
                                                    fetchData={fetchPosts} 
                                                />
                                            </div>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Card>
                            <Card.Body className="text-center">
                                <Card.Text>No posts available</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            <ViewComments
                postId={selectedPostId} 
                showModal={showModal} 
                handleClose={handleCloseModal} 
                onCommentDeleted={handleCommentDeleted} 
            />
        </div>
    );
}
