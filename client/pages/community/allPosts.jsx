import {useQuery} from '@apollo/client/react';
import Link from 'next/link';
import queries from '@/queries/blogQueries.js';

//displays all blog posts in a user's feed
export default function AllPosts() {
    const {loading, error, data} = useQuery(queries.GET_BLOGS);

    if (data){
        const posts = data.blogs;
       return (
        <div>
            <h1>Community Posts</h1>
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

