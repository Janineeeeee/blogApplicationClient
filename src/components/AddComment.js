import { useState } from 'react';
import { Button, Form, Alert, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function AddComment({ postId, showModal, handleClose, onCommentAdded }) {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://swiftink.onrender.com/posts/addComment/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ comment }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add comment');
            }

            const newComment = {
                commentId: data.comment.commentId,
                username: data.comment.username,
                userId: data.comment.userId,
                comment,
                createdOn: new Date().toISOString(),
            };

            Swal.fire('Success', data.message, 'success');
            setComment('');
            onCommentAdded(newComment);
            handleClose();
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add a Comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="comment">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your comment here..."
                            required
                        />
                    </Form.Group>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Button className="mt-2" type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};