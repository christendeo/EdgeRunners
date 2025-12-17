import {useState, useContext} from 'react';
import {useMutation} from '@apollo/client/react';
import { useRouter } from 'next/router'
import ReactModal from 'react-modal';
import queries from '../queries/blogQueries.js';
import {AuthContext} from "../lib/userAuthContext";

ReactModal.setAppElement('#__next');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    borderRadius: '4px',
    background: "#007E6E"
  }
};

//component for deleting blog posts with react modal
export default function DeletePost(props){
  const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
  const [blog, setBlog] = useState(props.blog);
  const [errorMessage, setErrorMessage] = useState(null);

  const userAuth = useContext(AuthContext);
  const router = useRouter();

  const [removeBlog, {loading, error}] = useMutation(queries.DELETE_BLOG, {
    update(cache) { //update cache upon successful mutation
      cache.modify({
        fields: {
          blogs(existingBlogs, {readField}) {
            return existingBlogs.filter(
              (b) => blog._id !== readField('_id', b)
            );
          }
        }
      });
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await removeBlog({
        variables: {
          _id: blog._id
        }
      });
      setShowDeleteModal(false);
      alert('Your post has been deleted');
      props.handleClose();
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setBlog(null);
    props.handleClose();
  };

  return (
    <div>
      <ReactModal
        name='deleteModal'
        isOpen={showDeleteModal}
        contentLabel='Delete Post'
        style={customStyles}
      >
        <div className='text-lg text-center'>
          <p>Are you sure you want to delete this post?</p>
          {errorMessage && (
            <p>An error has occured. {errorMessage}</p>
          )}
          {loading && (
            <p>Loading...</p>
          )}
          <form
            className='form'
            id='delete-blog-post'
            onSubmit={handleSubmit}
          >
            <button className="hover:underline" type='submit'>Delete Post</button>
          </form>
          <button className="hover:underline" onClick={handleCloseDeleteModal}>Cancel</button>
        </div>
      </ReactModal>
    </div>
  );
}