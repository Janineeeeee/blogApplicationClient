import { useState, useEffect, useContext } from 'react';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';

export default function Posts() {
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});

    
    const fetchUsers = () => {
        fetch('https://swiftink.onrender.com/users/all-user', { 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            return res.json();
        })
        .then(data => {
            const userMap = {};
            data.forEach(user => {
                userMap[user._id] = user.username; 
            });
            setUsers(userMap);
        })
        .catch(err => console.error('Error fetching users:', err));
    };

    const fetchPosts = () => {
        fetch("https://swiftink.onrender.com/posts/getAllPost", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch posts');
            }
            return res.json();
        })
        .then(data => {
            const enrichedPosts = data.map(post => ({
                ...post,
                comments: post.comments.map(comment => ({
                    ...comment,
                    username: users[comment.userId] || 'Unknown User'
                })),
                username: users[post.userId] || 'Unknown User'
            }));
            setPosts(enrichedPosts);
        })
        .catch(err => console.error('Error fetching posts:', err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    useEffect(() => {
        if (Object.keys(users).length > 0) {
            fetchPosts();
        }
    }, [users]);

    return (
        (user.isAdmin === true)
        ? <AdminView postData={posts} fetchPosts={fetchPosts} />
        : <UserView postData={posts} fetchPosts={fetchPosts}/>
    );
}
