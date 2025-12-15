import {useRouter} from 'next/router';
import {useQuery} from '@apollo/client/react';
import { useState } from 'react';
import queries from '@/queries/blogQueries.js';
import DeletePost from '@/components/DeletePost';
import EditPost from '@/components/EditPost';

//displays individual blog pages
export default function Post() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deletePost, setDeletePost] = useState(null);
    const [editPost, setEditPost] = useState(null);

    const router = useRouter();
    const {id} = router.query;

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
            <div>
                <h1>Post Page</h1>
                <h2>{post.title}</h2>
                <button
                    onClick={() => {
                        handleOpenDeleteModal(post);
                    }}
                >
                    Delete
                </button>
                <button
                    onClick={() => {
                        handleOpenEditModal(post);
                    }}
                >
                    Edit Post
                </button>
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