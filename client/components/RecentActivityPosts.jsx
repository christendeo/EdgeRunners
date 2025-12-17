// Display user's recent blog posts activity
import React, {useContext, useMemo} from "react";
import Link from "next/link";
import {useQuery} from "@apollo/client/react";
import queries from "../queries/blogQueries.js";
import {AuthContext} from "../lib/userAuthContext";
import conversionHelpers from "../helpers/conversionHelpers";

// Import Tailwind
import tailwindCSS from "../lib/tailwindUIClasses";

// Import custom font
import localFont from "next/font/local";
const NimbusFont = localFont({
    src: "../public/NimbuDemo-Regular.otf",
    variable: "--font-nimbus"
});

export default function RecentActivity() {
    const userAuth = useContext(AuthContext);
    const currentUser = userAuth.user;

    const { data, loading, error } = useQuery(queries.GET_BLOGS);

    const myRecentPosts = useMemo(() => {
        let postResults = [];

        if (!currentUser || !currentUser._id) {
            return postResults;
        }

        if (!data || !data.blogs) {
            return postResults;
        }

        postResults = data.blogs.filter((post) => {
            return post.user_id === currentUser._id;
        });

        // Ensure the posts are sequences properly
        postResults.sort((a, b) => {
            let dateA = conversionHelpers.parseMMDDYYYY(a.created_at).getTime();
            let dateB = conversionHelpers.parseMMDDYYYY(b.created_at).getTime();
            return dateB - dateA;
        });

        return postResults.slice(0, 3);
    }, [data, currentUser]);

    // Display recent activity window
    return (
        <div className={tailwindCSS.cardSoft}>
            <div className="flex items-center justify-between">
                <h2 className={`${tailwindCSS.h2} ${NimbusFont.className}`}>Recent Activity</h2>
                <Link className={tailwindCSS.link} href="/community/allPosts">
                    View all
                </Link>
            </div>

            <div className="mt-4">
                {loading && <p>Loading...</p>}

                {/*For any errors*/}
                {error && (
                    <div className={tailwindCSS.alertError}>
                        Oh no! Error loading posts: {error.message}
                    </div>
                )}

                {!loading && !error && myRecentPosts.length === 0 && (
                    <p>No posts yet. Create one in the Community tab to get started!</p>
                )}

                {!loading && !error && myRecentPosts.length > 0 && (
                    <ul className="flex flex-col gap-y-3">
                        {myRecentPosts.map((post) => {
                            return (
                                <li key={post._id} className={tailwindCSS.card}>
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold">{post.title}</div>
                                        <div className="text-sm opacity-70">{post.created_at}</div>
                                    </div>

                                    <div className="mt-1 text-sm opacity-80">
                                        Post Type: {post.post_type}
                                    </div>

                                    <div className="mt-2">
                                        <Link className={tailwindCSS.link} href={`/community/${post._id}`}>
                                            Open Post
                                        </Link>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}