import { Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function UpdatePost({ post, fetchPosts, onClose }) {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [images, setImages] = useState(post.images);
    const [showEdit, setShowEdit] = useState(true); // Start as true to show modal
    const [imageError, setImageError] = useState(null);

    const closeEdit = () => {
        setShowEdit(false);
        onClose(); // Notify parent to close the editing state
    };

    const editPost = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            Swal.fire({
                icon: 'warning',
                title: 'Please fill in all fields',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        try {
            const response = await fetch(`https://swiftink.onrender.com/posts/updatePost/${post._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, content, images })
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully Updated',
                    showConfirmButton: false,
                    timer: 1500
                });
                closeEdit();
                fetchPosts();
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: error.message,
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const handleImageUpload = async (file) => {
        if (file && file.size > 50 * 1024 * 1024) {
            setImageError("File size is too large. Please upload a file less than 50MB.");
            return;
        }

        if (file) {
            const imgBase64 = await convertToBase64(file);
            setImages(imgBase64);
            setImageError(null);
        }
    };

    return (
        <Modal show={showEdit} onHide={closeEdit} aria-hidden={false}>
            <Form onSubmit={editPost}>
                <Modal.Header closeButton style={{ backgroundColor: 'black', color: 'white' }}>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="postImage">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept='.jpeg, .png, .jpg'
                            onChange={e => handleImageUpload(e.target.files[0])}
                        />
                        {imageError && <div style={{ color: 'red' }}>{imageError}</div>}
                        {images && <img src={images} alt="Uploaded" style={{ width: '100%', marginTop: '10px' }} />}
                    </Form.Group>
                    <Form.Group controlId="postTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="postContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEdit}>Close</Button>
                    <Button variant="dark" type="submit">Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

function convertToBase64(file) {
    return new Promise((res, rej) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => res(fileReader.result);
        fileReader.onerror = (e) => rej(e);
    });
}
