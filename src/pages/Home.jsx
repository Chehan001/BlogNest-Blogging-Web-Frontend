import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Clock, Heart, Eye, ArrowRight, Sparkles, BookOpen, Users, Award, Star, Zap, Globe } from "lucide-react";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import blogService from "../services/blogService";
import BlogCard from "../components/BlogCard";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalStories: 0,
    writers: 0,
    reactions: 0,
    awards: 0
  });
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, [selectedCategory, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllBlogs(selectedCategory, searchQuery);
      setBlogs(data);
      setLoading(false);

      // Update stats based on data (optional, or fetch from separate stats endpoint)
      setStats(prev => ({ ...prev, totalStories: data.length }));

    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const categories = ["All", "Technology", "Design", "Travel", "Lifestyle", "Food", "Business"];

  const statsData = [
    { icon: BookOpen, label: "Total Stories", value: stats.totalStories || "0", color: "from-blue-500 to-cyan-500" },
    { icon: Users, label: "Active Writers", value: stats.writers || "0", color: "from-purple-500 to-pink-500" },
    { icon: Heart, label: "Total Reactions", value: stats.reactions || "0", color: "from-rose-500 to-red-500" },
    { icon: Award, label: "Awards Given", value: stats.awards || "0", color: "from-amber-500 to-orange-500" }
  ];

  const features = [
    {
      title: "Express Yourself",
      desc: "Share your unique perspective with a global audience",
      icon: Sparkles,
      gradient: "from-violet-500 to-purple-500"
    },
    {
      title: "Build Community",
      desc: "Connect with like-minded readers and writers",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Grow Your Reach",
      desc: "Get discovered through our recommendation engine",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "Earn Revenue",
      desc: "Monetize your content with our partner program",
      icon: Zap,
      gradient: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <>
     <Navbar />
    <div className="home-container">
      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="hero-badge-text">Welcome to BlogNest</span>
          </div>

          <h1 className="hero-title">
            Discover Stories That
            <br />
            <span className="hero-title-gradient">Inspire & Transform</span>
          </h1>

          <p className="hero-description">
            Join a vibrant community of storytellers and readers. Share your voice,
            explore diverse perspectives, and connect through powerful narratives.
          </p>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-glow"></div>
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for stories, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          <div className="hero-buttons">
            <button
              onClick={() => window.location.href = '/add-blog'}
              className="btn-primary"
            >
              Start Writing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => window.location.href = '/all-blogs'}
              className="btn-secondary"
            >
              Explore Stories
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <div className={`stat-icon bg-gradient-to-br ${stat.color}`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-section">
        <div className="category-container">
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={`category-btn ${selectedCategory === category.toLowerCase() ? 'active' : 'inactive'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="featured-section">
        <div className="featured-container">
          <div className="featured-header">
            <div className="featured-title-wrapper">
              <div className="featured-icon">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="featured-title">Featured Stories</h2>
                <p className="featured-subtitle">Handpicked stories from our community</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/all-blogs'}
              className="view-all-btn"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading amazing stories...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-inner">
                <BookOpen className="empty-state-icon" />
                <h3 className="empty-state-title">No Stories Yet</h3>
                <p className="empty-state-text">Be the first to share your amazing story with our community!</p>
                <button
                  onClick={() => window.location.href = '/add-blog'}
                  className="btn-primary"
                >
                  Write Your First Story
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="blog-grid">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features & Trending Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-grid">
            <div>
              <h3 className="features-main-title">Why Choose BlogNest?</h3>
              <div className="features-cards">
                {features.map((feature, i) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={i} className="feature-card">
                      <div className={`feature-icon bg-gradient-to-br ${feature.gradient}`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="feature-title">{feature.title}</h4>
                      <p className="feature-desc">{feature.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="trending-title">Trending Topics</h3>
              <div className="trending-card">
                {trendingTopics.length === 0 ? (
                  <div className="trending-empty">
                    <TrendingUp className="trending-empty-icon" />
                    <p className="trending-empty-text">No trending topics yet</p>
                    <p className="trending-empty-subtext">Check back soon!</p>
                  </div>
                ) : (
                  <div className="trending-list">
                    {trendingTopics.map((topic, i) => (
                      <div key={i} className="trending-item">
                        <div className="trending-item-header">
                          <span className="trending-item-name">#{topic.name}</span>
                          <span className="trending-item-count">{topic.count} posts</span>
                        </div>
                        <div className="trending-progress-bg">
                          <div
                            className="trending-progress-bar"
                            style={{ width: `${(topic.count / trendingTopics[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-wrapper">
            <div className="cta-glow"></div>
            <div className="cta-content">
              <div className="cta-decoration-1"></div>
              <div className="cta-decoration-2"></div>

              <div className="cta-inner">
                <Globe className="cta-icon" />
                <h2 className="cta-title">Ready to Share Your Story?</h2>
                <p className="cta-text">
                  Join thousands of writers who are already sharing their voices and making an impact on BlogNest
                </p>
                <button
                  onClick={() => window.location.href = '/add-blog'}
                  className="cta-button"
                >
                  Create Your First Post
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="footer-logo-text">BlogNest</span>
          </div>
          <p className="footer-tagline">Where stories come to life</p>
          <div className="footer-links">
            <a href="/terms" className="footer-link">Terms</a>
            <a href="/privacy" className="footer-link">Privacy</a>
            <a href="/contact" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
  
}

export default Home;