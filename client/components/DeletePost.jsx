import {useState, useContext} from 'react';
import {useMutation} from '@apollo/client/react';
import { useRouter } from 'next/router'
import ReactModal from 'react-modal';
import localFont from 'next/font/local';
import queries from '../queries/blogQueries.js';
import {AuthContext} from "../lib/userAuthContext";
import tailwindCSS from '../lib/tailwindUIClasses';

const NimbusFont = localFont({ 
    src: '../public/NimbuDemo-Regular.otf',
    variable: '--font-nimbus' 
});

ReactModal.setAppElement('#__next');

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
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background text-foreground rounded-lg border p-6 w-[90%] max-w-[500px] focus:outline-none"
        overlayClassName="fixed inset-0"
      >
        <h3 className={`${tailwindCSS.h2} ${NimbusFont.className} mb-4 text-center`}>Delete Post</h3>
        
        <p className="text-center mb-4">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>

        {errorMessage && (
          <p className={`${tailwindCSS.alertError} mb-4`}>
            An error has occurred. {errorMessage}
          </p>
        )}

        {loading && (
          <p className="text-center text-sm opacity-70 mb-4">Loading...</p>
        )}

        <form
          id='delete-blog-post'
          onSubmit={handleSubmit}
          className="flex gap-2 justify-center"
        >
          <button className={tailwindCSS.btnDanger} type='submit'>
            Delete Post
          </button>
          <button 
            className={tailwindCSS.btnSecondary}
            type='button'
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </button>
        </form>
      </ReactModal>
    </div>
  );
}