import {useState, useContext} from 'react';
import {useMutation} from '@apollo/client/react';
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
                    title: formData.title,
                    content: formData.content,
                    post_type: formData.postType
                }
            });
    };

    return (
        <div>
            <ReactModal
                name='editModal'
                isOpen={showEditModal}
                contentLabel='Edit Post'
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background text-foreground rounded-lg border p-6 w-[90%] max-w-[600px] focus:outline-none"
                overlayClassName="fixed inset-0"
            >
                <h3 className={`${tailwindCSS.h2} ${NimbusFont.className} mb-4`}>Edit Post</h3>
                
                <form 
                    id='edit-blog-post'
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <input 
                            className={tailwindCSS.input}
                            type='text' 
                            name='title'
                            value={formData.title}
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Content
                        </label>
                        <textarea 
                            className={tailwindCSS.input}
                            name='content'
                            value={formData.content}
                            onChange={handleChange}
                            required 
                            rows="4"
                        />
                    </div>

                    {errorMessage && (
                        <p className={tailwindCSS.alertError}>
                            An error has occurred. {errorMessage}
                        </p>
                    )}

                    <div className="flex gap-2 pt-2">
                        <button className={tailwindCSS.btnPrimary} type='submit'>
                            Update Post
                        </button>
                        <button 
                            className={tailwindCSS.btnSecondary}
                            type='button'
                            onClick={handleCloseEditModal}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </ReactModal>
        </div>
    );

}
