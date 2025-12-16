import {useState, useContext} from 'react';
import {useMutation} from '@apollo/client/react';
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

//component for editing blog posts with react modal
export default function EditPost(props){
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [blog, setBlog] = useState(props.blog);
    const [errorMessage, setErrorMessage] = useState(null);

    const userAuth = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: blog.title,
        content: blog.content,
        postType: blog.post_type
    });

    const [editBlog] = useMutation(queries.UPDATE_BLOG, {
        onCompleted: () => {
            setShowEditModal(false);
            alert('Your blog post has been updated');
            props.handleClose();
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });


    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setBlog(null);
        props.handleClose();
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
            editBlog({
                variables: {
                    _id: blog._id,
                    user_id: userAuth.user._id,
                    title: formData.title,
                    content: formData.content,
                    post_type: formData.postType
                }
            });
    };

    return (
        <div className='form'>
            <ReactModal
                name='editModal'
                isOpen={showEditModal}
                contentLabel='Edit Post'
                style={customStyles}
            >
                <form
                    className='form'
                    id='edit-blog-post'
                    onSubmit={handleSubmit}
                >
                    {errorMessage && (
                        <p>An error has occured. {errorMessage}</p>
                    )}
                    <div className='form-group'>
                        <label>
                            Title:
                            <br />
                            <input
                                type='text' 
                                name='title'
                                value={formData.title}
                                onChange={handleChange} 
                                required 
                            />
                        </label>
                    </div>
                    <div className='form-group'>
                        <label>
                            Type your post here:
                            <br />
                            <input
                                type="text" 
                                name='content'
                                value={formData.content}
                                onChange={handleChange}
                                required 
                            />
                        </label>
                    </div>
                <button type='submit'>Update Post</button>
                </form>
                <button onClick={handleCloseEditModal}>Cancel</button> 
            </ReactModal>
        </div>
    );

}
