import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function DeletePost({ post, fetchData }) {
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = () => {
    setLoading(true);

    fetch(`https://swiftink.onrender.com/posts/deletePost/${post._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || 'Unknown error occurred');
          });
        }
        return res.json();
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Post deleted successfully.',
          confirmButtonText: 'OK',
        });
        fetchData();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Error: ${error.message}`,
          confirmButtonText: 'OK',
        });
      })
      .finally(() => {
        setLoading(false);
        setShow(false); 
      });
  };

  return (
    <>
      <Button variant="outline-danger" size="sm" onClick={() => setShow(true)}>Delete Post</Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this post? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
