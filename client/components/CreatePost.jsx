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
        <div className='flex justify-center bg-darkgreen mx-12 my-8 rounded-full'>
            <form className='text-center text-white text-lg py-2 space-x-2' id='add-blog' onSubmit={onSubmit}>
                <div>
                    <label>
                        Title
                        <br />
                        <input className="bg-white text-black"
                            type='text' 
                            name='title'
                            value={formData.title}
                            onChange={handleChange} 
                            required 
                            />
                    </label>
                    <br />
                    <br />
                </div>
                <div>
                    <label>
                        Type your post here
                        <br />
                        <input className="bg-white text-black"
                        type="text" 
                        name='content'
                        value={formData.content}
                        onChange={handleChange}
                        required 
                        />
                    </label>
                    <br />
                    <br />
                </div>
                <p>Post Type</p>
                <div>
                    <label>
                        <input 
                            type="radio"
                            name="postType"
                            id="PT1"
                            value="PROGRESS"
                            onChange={handleChange}
                            required
                        />
                        Progress Update
                    </label>
                    <br />
                    <label>
                        <input 
                            type="radio"
                            name="postType"
                            id="PT2"
                            value="REVIEW"
                            onChange={handleChange}
                        />
                        Review
                    </label>
                    <br />
                    <label>
                        <input 
                            type="radio"
                            name="postType"
                            id="PT3"
                            value="COMMENT"
                            onChange={handleChange}
                        />
                        Comment
                    </label>
                </div>
                <br />
                <br />
                {errorMessage && (
                    <p>An error has occured. {errorMessage}</p>
                )}
                <button className="px-4 rounded-full border-1 border-white hover:underline" type='submit'>Post</button>
                <button className="px-4 rounded-full border-1 border-white hover:underline"
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

