import {useState} from 'react';
import {useMutation} from '@apollo/client/react';
import {redirect} from 'next/navigation';
import ReactModal from 'react-modal';
import queries from '../queries/blogQueries.js';

ReactModal.setAppElement('#root');
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
  const [errorMessage, setErrorMessage] = useState('');

  const [removeBlog, {error}] = useMutation(queries.DELETE_BLOG, {
    onCompleted: () => { //fires upon successful completion of the mutation
      setShowDeleteModal(false);
      alert('Your post has been deleted');
      props.handleClose();
      redirect('community/allposts');
    },
    onError: () => { //fires when an error is returned
      setErrorMessage(error.message);
    },
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
        {error && (
          <p>An error has occured. {errorMessage}</p>
        )}
        <form
          className='form'
          id='delete-blog-post'
          onSubmit={(e) => {
            e.preventDefault();
            removeBlog({
              variables: {
                "_id": blog._id,
                "user_id": props.user_id
              }
            });
          }}
        >
          <button type='submit'>Delete Post</button>
        </form>
        <button onClick={handleCloseDeleteModal}>Cancel</button>
      </ReactModal>
    </div>
  );
}