import {useMutation} from '@apollo/client/react';
import queries from '../queries/blogQueries.js';

//component for creating blog posts
export default function CreatePost (props) {
    const [addBlog] = useMutation(queries.CREATE_BLOG, {
        update(cache, {data: addBlog}) {
            const {blogs} = cache.readQuery({
                query: queries.GET_BLOGS
            });
            cache.writeQuery({
                query: queries.GET_BLOGS,
                data: {blogs: [...blogs, addBlog]}
            });
        }
    });

    const onSubmit = (e) => {
        e.preventDefault();
        let title = document.getElementById('title');
        let content = document.getElementById('content');
        let postType = document.getElementById('postType');

        //Are we using session data to store user id?
        addBlog({
            variables: {
                "user_id": props.user_id,
                "title": title.value,
                "content": content.value,
                "post_type": postType.value
            }
        });
        document.getElementById('add-blog').reset();
        alert('Blog Post Added!');
        props.closeAddFormState();
    };

    return (
        <div className='form'>
            <form className='form' id='add-blog' onSubmit={onSubmit}>
                <div className='form-group'>
                    <label>
                        Title:
                        <br />
                        <input id='title' required autoFocus={true} />
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Type your post here:
                        <br />
                        <input id='content' required />
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        Post Type:
                        <select id='postType'>
                            <option key='progress' value='PROGRESS'>Progress Update</option>
                            <option key='review' value='REVIEW'>Review</option>
                            <option key='comment' value='COMMENT'>Comment</option>
                        </select>
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

