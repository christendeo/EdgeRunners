import {useRouter} from 'next/router';
import {useQuery} from '@apollo/client/react';
import { useState, useEffect, useContext } from 'react';
import localFont from 'next/font/local';
import queries from '@/queries/blogQueries.js';
import DeletePost from '@/components/DeletePost';
import EditPost from '@/components/EditPost';
import {AuthContext} from "../../lib/userAuthContext";

const NimbusFont = localFont({ 
  src: '../../public/NimbuDemo-Regular.otf',
  variable: '--font-nimbus' 
});

//displays individual blog pages
export default function Post() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deletePost, setDeletePost] = useState(null);
    const [editPost, setEditPost] = useState(null);

    const router = useRouter();
    const {id} = router.query;

    //verify that the user is logged in
    const userAuth = useContext(AuthContext);

    useEffect(() => {
        if (userAuth.authLoaded && !userAuth.user) {
            router.push("/login");
        }
    }, [userAuth.authLoaded, userAuth.user, router]); 

    const {loading, error, data} = useQuery(queries.GET_BLOG, {
        variables: {_id: id}
    });

    const handleOpenDeleteModal = (post) => {
        setShowDeleteModal(true);
        setDeletePost(post);
    };

    const handleOpenEditModal = (post) => {
        setShowEditModal(true);
        setEditPost(post);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    if (data) {
        const post = data.getBlogById;
        return (
            <>
            <div className={NimbusFont.className}>
                <div className='flex flow-root text-white mx-12 my-8 border-b-4 border-white pb-2'>
                    <h1 className='float-left text-4xl'>FuelMe Community</h1>
                </div>
            </div>
            <div className="flex text-white mx-12 my-8">
                <h2 className="text-3xl">{post.title}</h2>
            </div>
            <div className="flex text-white mx-12 my-8">
                <p className="text-xl">{post.content}</p>
            </div>
            <div className=' mx-12 my-8 space-x-4'>
                <button className="px-4 rounded-full bg-lightgreen hover:underline"
                onClick={() => {
                    handleOpenDeleteModal(post);
                }}
            >
                Delete
            </button>
            <button className="px-4 rounded-full bg-lightgreen hover:underline"
                onClick={() => {
                    handleOpenEditModal(post);
                }}
            >
                Edit Post
            </button>
            </div>

            {showDeleteModal && (
                <DeletePost 
                    isOpen={showDeleteModal}
                    handleClose={handleCloseModals}
                    blog={deletePost}
                />
            )}
            {showEditModal && (
                <EditPost
                    isOpen={showEditModal}
                    handleClose={handleCloseModals}
                    blog={editPost}
                />
            )}

            </>
        );
    }
    else if (loading) {
        return (<div>Loading...</div>);
    }
    else if (error) {
        return (<div>{error.message}</div>);
    }
}