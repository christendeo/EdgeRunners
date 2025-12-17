import {useMutation} from '@apollo/client/react';
import {useState, useContext} from 'react';
import {useRouter} from 'next/router';
import localFont from 'next/font/local';
import queries from '../queries/blogQueries.js';
import {AuthContext} from "../lib/userAuthContext";
import tailwindCSS from '../lib/tailwindUIClasses';

const NimbusFont = localFont({ 
    src: '../public/NimbuDemo-Regular.otf',
    variable: '--font-nimbus' 
});

//component for creating blog posts
export default function CreatePost (props) {
    const [errorMessage, setErrorMessage] = useState(null);
    const userAuth = useContext(AuthContext);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        postType: ''
    });

    const [addBlog] = useMutation(queries.CREATE_BLOG, {
        onCompleted: () => {
            document.getElementById('add-blog').reset();
            alert('Blog Post Added!');
            props.closeAddFormState();
            router.reload();
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        addBlog({
            variables: {
                user_id: userAuth.user?._id,
                title: formData.title,
                content: formData.content,
                post_type: formData.postType
            }
        });
    };

    return (
        <div className={`${tailwindCSS.card} mb-6`}>
            <h3 className={`${tailwindCSS.h2} ${NimbusFont.className} mb-4`}>Create New Post</h3>
            
            <form id='add-blog' onSubmit={onSubmit} className="space-y-4">
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
                        placeholder="Enter post title"
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
                        placeholder="Type your post here..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Post Type</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input 
                                type="radio"
                                name="postType"
                                value="PROGRESS"
                                onChange={handleChange}
                                required
                            />
                            <span>Progress Update</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input 
                                type="radio"
                                name="postType"
                                value="REVIEW"
                                onChange={handleChange}
                            />
                            <span>Review</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input 
                                type="radio"
                                name="postType"
                                value="COMMENT"
                                onChange={handleChange}
                            />
                            <span>Comment</span>
                        </label>
                    </div>
                </div>

                {errorMessage && (
                    <p className={tailwindCSS.alertError}>
                        An error has occurred. {errorMessage}
                    </p>
                )}

                <div className="flex gap-2 pt-2">
                    <button className={tailwindCSS.btnPrimary} type='submit'>
                        Post
                    </button>
                    <button 
                        className={tailwindCSS.btnSecondary}
                        type='button'
                        onClick={() => {
                            document.getElementById('add-blog').reset();
                            props.closeAddFormState();
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

