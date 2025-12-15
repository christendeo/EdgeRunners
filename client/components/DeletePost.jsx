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
    border: '1px solid #28547a',
    borderRadius: '4px'
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
          _id: blog._id,
          user_id: userAuth.user._id
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
          <button type='submit'>Delete Post</button>
        </form>
        <button onClick={handleCloseDeleteModal}>Cancel</button>
      </ReactModal>
    </div>
  );
}