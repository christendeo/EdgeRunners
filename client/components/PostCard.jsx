import Link from 'next/link';
import localFont from 'next/font/local';
import tailwindCSS from '../lib/tailwindUIClasses';

const NimbusFont = localFont({ 
    src: '../public/NimbuDemo-Regular.otf',
    variable: '--font-nimbus' 
});

export default function PostCards(props){
    const post = props.post;
    
    return (
        <div className={tailwindCSS.card}>
            <div className="flex items-start justify-between gap-4">
                <Link 
                    className={`${tailwindCSS.link} text-xl ${NimbusFont.className}`} 
                    href={`/community/${post._id}`}
                >
                    {post.title}
                </Link>
                
                <div className="text-s opacity-70 text-right flex-shrink-0">
                    <div>Created: {post.created_at}</div>
                    <div>Updated: {post.updated_at}</div>
                    <div>By: {post.user.first_name} {post.user.last_name}</div>
                </div>
            </div>
        </div>
    );
}