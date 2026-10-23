import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

type BlogGridProps = {
  blogs: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    feature_image_url: string | null;
    author_id: string | null;
    profiles: { user_id: string; full_name: string } | null;
    published_at: string | null;
    category: string | null;
  }>;
};

export function BlogGrid({ blogs }: BlogGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="group rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-colors duration-300"
        >
          {blog.feature_image_url ? (
            <Image
              src={blog.feature_image_url}
              alt={blog.title}
              width={400}
              height={250}
              className="aspect-[16/10] w-full h-48 object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
            />
          ) : (
            <div
              className="aspect-[16/10] w-full h-48 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center text-white/50 text-xs font-medium"
            >
              No Image
            </div>
          )}

          <div className="p-4">
            <Link
              href={`/blog/${blog.slug}`}
              className="block text-sm font-medium text-white hover:text-primary transition-colors group"
            >
              {blog.title}
            </Link>

            <p className="mt-2 line-clamp-2 text-xs text-gray-400">
              {blog.excerpt}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <User className="w-3 h-3" />
              {blog.profiles?.full_name || "Xylos AI"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}