import {useMutation} from '@apollo/client/react';
import {useState, useContext} from 'react';
import {useRouter} from 'next/router';
import queries from '../queries/blogQueries.js';
import {AuthContext} from "../lib/userAuthContext";

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
                user_id: userAuth.user._id,
                title: formData.title,
                content: formData.content,
                post_type: formData.postType
            }
        });
    };

    return (
        <div className='form'>
            <form className='form' id='add-blog' onSubmit={onSubmit}>
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
                <div className='form-group'>
                    <label>
                        Progress Update
                        <input 
                            type="radio"
                            name="postType"
                            id="PT1"
                            value="PROGRESS"
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Review
                        <input 
                            type="radio"
                            name="postType"
                            id="PT2"
                            value="REVIEW"
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Comment
                        <input 
                            type="radio"
                            name="postType"
                            id="PT3"
                            value="COMMENT"
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <br />
                <br />
                <button type='submit'>Post</button>
                <button
                    type='button'
                    onClick={() => {
                        document.getElementById('add-blog').reset();
                        props.closeAddFormState();
                    }}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

