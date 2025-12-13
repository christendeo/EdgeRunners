import {useState} from 'react';
import {useMutation} from '@apollo/client/react';
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

//component for editing blog posts with react modal
export default function EditPost(props){
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [blog, setBlog] = useState(props.blog);

    const [editBlog] = useMutation(queries.UPDATE_BLOG);

    let title, content, postType;

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setBlog(null);
        props.handleClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editBlog({
            variables: {
                '_id': blog._id,
                'user_id': props.user_id,
                'title': title.value,
                'content': content.value,
                'post_type': postType.value
            }
        });

        title.value = '';
        content.value = '';
        postType.value = '1';

        setShowEditModal(false);
        alert('Your blog post has been updated');
        props.handleClose();
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
                    <div className='form-group'>
                        <label>
                            Title:
                            <br />
                            <input 
                                ref={(node) => {
                                    title = node;
                                }}
                                defaultValue={blog.title}
                                autoFocus={true}
                            />
                        </label>
                    </div>
                    <div className='form-group'>
                        <label>
                            Type your post here:
                            <br />
                            <input 
                                ref={(node) => {
                                    content = node;
                                }}
                                defaultValue={blog.content}
                            />
                        </label>
                    </div>
                    <div className='form-group'>
                        <label>
                            Post Type:
                            <select 
                                id='postType'
                                defaultValue={blog.post_type}
                                ref={(node) => {
                                    postType = node;
                                }}
                            >
                                <option key='progress' value='PROGRESS'>Progress Update</option>
                                <option key='review' value='REVIEW'>Review</option>
                                <option key='comment' value='COMMENT'>Comment</option>
                            </select>
                        </label>
                </div>
                <button type='submit'>Update Post</button>
                </form>
                <button onClick={handleCloseEditModal}>Cancel</button> 
            </ReactModal>
        </div>
    );

}
