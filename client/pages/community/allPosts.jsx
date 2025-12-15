import {useQuery} from '@apollo/client/react';
import {useState} from 'react';
import Link from 'next/link';
import localFont from 'next/font/local';
import queries from '@/queries/blogQueries.js';
import CreatePost from '@/components/CreatePost';

const NimbusFont = localFont({ 
  src: '../../public/NimbuDemo-Regular.otf',
  variable: '--font-nimbus' 
});

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
        <div className={NimbusFont.className}>
            <div className='flex flow-root text-white mx-12 my-8 border-b-4 border-white pb-2'>
                    <h1 className='float-left text-4xl'>FuelMe Community</h1>
                    <button className='float-right bg-lightgreen hover:bg-darkgreen text-lg font-bold py-2 px-4 rounded-full' onClick={() => setShowAddForm(!showAddForm)}>
                        Add Post
                    </button>
            </div>

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

