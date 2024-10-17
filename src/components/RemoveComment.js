import { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

export default function RemoveComment({ postId, commentId, onCommentRemoved }){
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    console.log(postId, commentId)

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Confirm Deletion',
            text: "This action cannot be undone. Do you want to proceed?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                const response = await fetch(`https://swiftink.onrender.com/posts/removeComment/${postId}/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete comment');
                }

                onCommentRemoved(commentId); 
                Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
            } catch (err) {
                Swal.fire('Error!', 'There was a problem deleting your comment.', 'error');
                console.error('Error deleting comment:', err);
            } finally {
                setLoading(false); 
            }
        }
    };

    return (
        (user.id || user.isAdmin) && (
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
            </Button>
        )
    );
};
