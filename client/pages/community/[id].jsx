import {useRouter} from 'next/router';
import {useQuery} from '@apollo/client/react';
import { useState, useEffect, useContext } from 'react';
import localFont from 'next/font/local';
import queries from '@/queries/blogQueries.js';
import DeletePost from '@/components/DeletePost';
import EditPost from '@/components/EditPost';
import {AuthContext} from "../../lib/userAuthContext";
import tailwindCSS from '../../lib/tailwindUIClasses';

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
            <div className={tailwindCSS.pageWrap}>
                <div className="flex items-center justify-between mb-4">
                    <h1 className={`${tailwindCSS.h1} ${NimbusFont.className}`}>
                        FuelMe Community
                    </h1>
                </div>

                <hr className="mb-4" />

                <div className={tailwindCSS.card}>
                    <h2 className={`${tailwindCSS.h2} ${NimbusFont.className} mb-4`}>
                        {post.title}
                    </h2>
                    <p className="text-base leading-relaxed mb-4">
                        {post.content}
                    </p>

					{userAuth.user._id === post.user_id && (
						<div className="flex gap-2 mt-6">
							<button 
								className={tailwindCSS.btnSecondary}
								onClick={() => handleOpenEditModal(post)}
							>
								Edit Post
							</button>
							<button 
								className={tailwindCSS.btnDanger}
								onClick={() => handleOpenDeleteModal(post)}
							>
								Delete
							</button>
						</div>
					)}
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
            </div>
        );
    }
    else if (loading) {
        return (
            <div className={tailwindCSS.pageWrap}>
                <p>Loading...</p>
            </div>
        );
    }
    else if (error) {
        return (
            <div className={tailwindCSS.pageWrap}>
                <p className={tailwindCSS.alertError}>{error.message}</p>
            </div>
        );
    }
}