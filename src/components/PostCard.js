import { useState, useContext } from 'react';
import { Card, ListGroup, ListGroupItem, Row, Col, Button } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import RemoveComment from './RemoveComment';
import AddComment from './AddComment';

export default function PostCard({ post, onAddComment }) {
    const { title, content, username, createdOn, images } = post;
    const { user } = useContext(UserContext);
    const [showComments, setShowComments] = useState(false); 
    const [comments, setComments] = useState(post.comments);
    const [showAddComment, setShowAddComment] = useState(false);

    const toggleComments = () => {
        setShowComments(prev => !prev); 
    };

    const handleCommentRemoved = (commentId) => {
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
    };

    const handleCommentAdded = (newComment) => {
        console.log("New comment added:", newComment); 
        setComments(prevComments => [...prevComments, newComment]);
        setShowAddComment(false); 
    };


    return (
        <Card className="mb-4">
            <Card.Body>
                <Row>
                    {images && (
                        <Col md={4}>
                            <Card.Img 
                                variant="top" 
                                src={images} 
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
                    <Col md={images ? 8 : 12}>
                        <div className="d-flex align-items-center mb-2">
                            <Card.Subtitle className="mt-2 text-muted">@{username}</Card.Subtitle>
                        </div>
                        <Card.Title>{title}</Card.Title>
                        <Card.Text>{content}</Card.Text>
                    </Col>
                </Row>
                
                <Card.Footer className="text-muted d-flex justify-content-between align-items-center">
                    <span>Created on: {new Date(createdOn).toLocaleDateString()}</span>
                    <div className="d-flex align-items-center">
                        {user.id && (
                            <Button 
                                variant="outline-primary" 
                                onClick={() => setShowAddComment(true)} 
                                className="me-2" // Add margin to the right
                            >
                                Add Comment
                            </Button>
                        )}
                        <Button 
                            variant="outline-success" 
                            onClick={toggleComments} 
                            className="ms-2"
                        >
                            {showComments ? 'Hide Comments' : 'Show Comments'}
                        </Button>
                    </div>
                </Card.Footer>
            </Card.Body>
            
            {showAddComment && (
                <AddComment 
                    postId={post._id} 
                    showModal={showAddComment} 
                    handleClose={() => setShowAddComment(false)} 
                    onCommentAdded={handleCommentAdded} 
                />
            )}

            {showComments && comments.length > 0 && ( 
                <ListGroup className="list-group-flush">
                    <ListGroupItem>
                        <strong>Comments:</strong>
                    </ListGroupItem>
                    {comments.map((comment) => (
                        <ListGroupItem key={comment.commentId} className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{comment.username}</strong>: {comment.comment} 
                                <span className="text-muted ms-5">
                                    Created on: {new Date(comment.createdOn).toLocaleDateString()} 
                                </span>
                            </div>
                            {user.id === comment.userId && (
                                <RemoveComment
                                    postId={post._id}
                                    commentId={comment.commentId}
                                    onCommentRemoved={handleCommentRemoved}
                                />
                            )}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            )}
        </Card>
    );
}
