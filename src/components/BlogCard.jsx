import React from "react";
import { Clock, Eye, Heart } from "lucide-react";

const BlogCard = ({ blog }) => {
    return (
        <article className="blog-card">
            <div className="blog-image-wrapper">
                <img
                    src={blog.image || "https://via.placeholder.com/800x600?text=Blog+Image"}
                    alt={blog.title}
                    className="blog-image"
                />
                <div className="blog-image-overlay"></div>
                {blog.category && (
                    <div className="blog-category-badge">
                        <span className="blog-category-text">{blog.category}</span>
                    </div>
                )}
                <div className="blog-like-btn">
                    <Heart className="w-5 h-5 text-rose-500" />
                </div>
            </div>

            <div className="blog-content">
                <div className="blog-author">
                    <img
                        src={
                            blog.author?.profilePicture ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (blog.author?.username || "default")
                        }
                        alt={blog.author?.username || "Author"}
                        className="blog-author-avatar"
                    />
                    <div className="blog-author-info">
                        <p className="blog-author-name">{blog.author?.username || "Anonymous"}</p>
                        <p className="blog-author-date">
                            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Just now"}
                        </p>
                    </div>
                </div>

                <h3 className="blog-title">{blog.title}</h3>

                <p className="blog-excerpt">
                    {blog.excerpt || blog.content?.substring(0, 100) + "..."}
                </p>

                <div className="blog-meta">
                    <div className="blog-meta-left">
                        {blog.readTime && (
                            <span className="blog-meta-item">
                                <Clock className="w-4 h-4" />
                                {blog.readTime}
                            </span>
                        )}
                        {blog.views !== undefined && (
                            <span className="blog-meta-item">
                                <Eye className="w-4 h-4" />
                                {blog.views}
                            </span>
                        )}
                    </div>
                    {blog.likes !== undefined && (
                        <span className="blog-likes">
                            <Heart className="w-4 h-4 fill-current" />
                            {blog.likes}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
