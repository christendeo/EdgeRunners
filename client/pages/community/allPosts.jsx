import {useQuery} from '@apollo/client/react';
import {useState} from 'react';
import Link from 'next/link';
import queries from '@/queries/blogQueries.js';
import CreatePost from '@/components/CreatePost';

//displays all blog posts in a user's feed
export default function AllPosts() {
    const [showAddForm, setShowAddForm] = useState(false);
    const {loading, error, data} = useQuery(queries.GET_BLOGS);

    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    if (data){
        const posts = data.blogs;
       return (
        <div>
            <h1>Community Posts</h1>
            <br />
            <button onClick={() => setShowAddForm(!showAddForm)}>
                Add Post
            </button>
            <br />
            {showAddForm && (
                <CreatePost closeAddFormState={closeAddFormState}/>
            )}
            {posts.map((post) => {
                return(<Link href={`/community/${post._id}`}>{post.title}</Link>);
            })}
        </div>
        ); 
    }
    else if (loading) {
        return (<div>Loading...</div>);
    }
    else if (error) {
         return (<div>{error.message}</div>);
    }

}

