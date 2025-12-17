import {useQuery} from '@apollo/client/react';
import {useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/router';
import localFont from 'next/font/local';
import queries from '@/queries/blogQueries.js';
import CreatePost from '@/components/CreatePost';
import PostCards from '@/components/PostCard';
import {AuthContext} from "../../lib/userAuthContext";
import tailwindCSS from '../../lib/tailwindUIClasses';

const NimbusFont = localFont({ 
  src: '../../public/NimbuDemo-Regular.otf',
  variable: '--font-nimbus' 
});

//displays all blog posts in a user's feed
export default function AllPosts() {
    const [showAddForm, setShowAddForm] = useState(false);
    const {loading, error, data} = useQuery(queries.GET_BLOGS);

    const router = useRouter();

    //verify that the user is logged in
    const userAuth = useContext(AuthContext);

    useEffect(() => {
        if (userAuth.authLoaded && !userAuth.user) {
            router.push("/login");
        }
    }, [userAuth.authLoaded, userAuth.user, router]);

    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    if (data){
        const posts = data.blogs;
       return (
        <div className={tailwindCSS.pageWrap}>
            {/* Header with title and add button */}
            <div className="flex items-center justify-between mb-2">
                <h1 className={`${tailwindCSS.h1} ${NimbusFont.className} -mb-4`}>
                    FuelMe Community
                </h1>
                <button 
                    className={tailwindCSS.btnPrimary}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    Add Post
                </button>
            </div>

            <hr className="mb-4" />

            {showAddForm && (
                <CreatePost closeAddFormState={closeAddFormState}/>
            )}

            <div className="space-y-4">
                {posts.map((post) => {
                    return <PostCards key={post._id} post={post}/>
                })}
            </div>
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

