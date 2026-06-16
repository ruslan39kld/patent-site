import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <div className="pt-8 border-t border-[#E5E7EB]">
      <h3 className="text-2xl font-bold text-[#1B3F7A] mb-8">Читайте также</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            onClick={() => window.scrollTo(0, 0)}
            className="group bg-[#F8F9FA] border border-[#E5E7EB] p-6 rounded-2xl hover:border-[#1B3F7A] hover:bg-white transition-all hover:shadow-md"
          >
            <div className="text-xs font-bold text-[#C8A028] uppercase tracking-wider mb-2">{post.category}</div>
            <h4 className="font-bold text-[#1F2937] group-hover:text-[#1B3F7A] transition-colors leading-snug">{post.title}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
}
