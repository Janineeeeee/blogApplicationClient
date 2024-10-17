import { useState, useContext, useEffect } from 'react';
import PostCard from '../components/PostCard';
import CreatePost from '../pages/CreatePost';
import { Button } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import AddComment from '../components/AddComment'; 

export default function UserView({ postData, setPostData, fetchPosts }) {
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const { user } = useContext(UserContext);

    const handlePostCreated = () => { 
        setShowCreatePost(false); 
        fetchPosts();
    };

    const openCommentModal = (postId) => {
        setSelectedPostId(postId);
        setShowCommentModal(true);
    };

    const closeCommentModal = () => {
        setShowCommentModal(false);
        setSelectedPostId(null); 
    };

    const handleCommentAdded = (newComment) => {
        setPostData(prevPosts => 
            prevPosts.map(post => 
                post._id === selectedPostId 
                    ? { ...post, comments: [...post.comments, newComment] } 
                    : post
            )
        );
    };

    return (
        <>
            {user.id && (
                <Button
                    variant="outline-dark"
                    className="mb-3" 
                    onClick={() => setShowCreatePost(prev => !prev)}
                >
                    <i className={`fas fa-${showCreatePost ? 'minus' : 'plus'} me-2`}></i>
                    {showCreatePost ? <span style={{ color: 'red' }}>Cancel</span> : 'Create Post'}
                </Button>
            )}
            {showCreatePost && <CreatePost onPostCreated={handlePostCreated} />}
            {postData.length > 0 ? (
                postData.map(post => (
                    <PostCard 
                        post={post} 
                        key={post._id} 
                        onAddComment={() => openCommentModal(post._id)}
                        onCommentAdded={handleCommentAdded} 
                    />
                ))
            ) : (
                <p>No posts available.</p>
            )}
            {showCommentModal && (
                <AddComment 
                    postId={selectedPostId} 
                    showModal={showCommentModal} 
                    handleClose={closeCommentModal} 
                    onCommentAdded={handleCommentAdded}
                />
            )}
        </>
    );
}
