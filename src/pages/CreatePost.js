import { useState, useContext } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export default function CreatePost({ onPostCreated }) {
    const { user } = useContext(UserContext);
    
    const [images, setImages] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageError, setImageError] = useState(null);

    const createPost = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`https://swiftink.onrender.com/posts/addPost`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    images: images,
                    title: title,
                    content: content
                })
            });
            
            const data = await response.json();

            if (data.message === "Post Already Exists") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Post Already Exists'
                });
            } else if (data) {
                setTitle("");
                setContent("");
                setImages(null);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Created New Post'
                });

                if (onPostCreated) {
                    onPostCreated();
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong'
            });
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setImageError("Invalid file type. Please upload a JPEG or PNG image.");
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setImageError("File size is too large. Please upload a file less than 50MB.");
            return;
        }

        const imgBase64 = await convertToBase64(file);
        setImages(imgBase64);
        setImageError(null);
    };

    return (
        <Card className="my-4">
            <Card.Body>
                <h2>Create a New Post</h2>
                {user.isAdmin ? (
                    <p className="text-danger">Admins are not allowed to create posts.</p>
                ) : (
                    <>
                        {imageError && <p className="text-danger">{imageError}</p>}
                        <Form onSubmit={createPost}>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter post title" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formContent">
                                <Form.Label>Content</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    placeholder="Enter post content" 
                                    value={content} 
                                    onChange={(e) => setContent(e.target.value)} 
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formImage">
                                <Form.Label>Image</Form.Label>
                                <Form.Control 
                                    type="file" 
                                    accept='.jpeg, .png, .jpg'
                                    onChange={e => handleImageUpload(e.target.files[0])} 
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="my-3">
                                Add Post
                            </Button>
                        </Form>
                        {images && <img src={images} alt="Uploaded preview" style={{ width: '100%', marginTop: '10px' }} />}
                    </>
                )}
            </Card.Body>
        </Card>
    );
}
