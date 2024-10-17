import { useEffect, useState, useCallback } from 'react';
import { Modal, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ViewComments({ postId, showModal, handleClose, onCommentDeleted }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComments = useCallback(() => {
        setLoading(true);
        setError(null);
        fetch(`https://swiftink.onrender.com/posts/viewComments/${postId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch comments');
            }
            return res.json();
        })
        .then(data => {
            setComments(data.comments);
        })
        .catch(err => {
            console.error('Error fetching comments:', err);
            setError(err.message);
        })
        .finally(() => setLoading(false));
    }, [postId]);

    const handleDeleteComment = (commentId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This comment will be permanently deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://swiftink.onrender.com/removeComment/${postId}/${commentId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete comment');
                    }

                    Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
                    setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
                    onCommentDeleted(commentId);
                } catch (err) {
                    Swal.fire('Error', err.message, 'error');
                }
            }
        });
    };

    useEffect(() => {
        if (showModal && postId) {
            fetchComments();
        }
    }, [showModal, postId, fetchComments]);

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>All Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <ListGroup>
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <ListGroup.Item key={comment.commentId} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{comment.username}</strong>: {comment.comment}
                                    </div>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment.commentId)}>
                                        Delete
                                    </Button>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No comments available.</p>
                        )}
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
