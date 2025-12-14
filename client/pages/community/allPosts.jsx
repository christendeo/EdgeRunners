import {useQuery} from '@apollo/client/react';
import queries from '../queries/blogQueries.js';
import DeletePost from '@/components/DeletePost.jsx';
//displays all blog posts in a user's feed
export default function AllPosts(props) {
    const posts = props.getAllBlogs;
console.log(posts);
    return (
        <div>
            <h1>All Posts</h1>
            {posts.map((post) => {
                return (
                    <p>{post.title}</p>
                );
            })}
        </div>
    );
}

export async function getServerSideProps(context) {
    const {loading, error, data} = useQuery(queries.GET_BLOGS, {fetchPolicy: 'cache-and-network'});
    if(data){
        return {props: data.getAllBlogs};
    }
}