import Link from 'next/link'

//pick a font?
export default function PostCards(props){
    const post = props.post
    return (
        <div className="flex flow-root bg-gray-400 text-white mx-12 my-8 rounded-full">
            <Link className="float-left hover:underline pl-8 text-2xl" href={`/community/${post._id}`}>{post.title}</Link>
            <div className="float-right grid grid-rows-3 grid-cols-1 pr-8 text-xs">
                <div><p>Created: {post.created_at}</p></div>
                <div><p>Updated: {post.updated_at}</p></div>
                <div><p>User: </p></div>
            </div>
        </div>
    );
}