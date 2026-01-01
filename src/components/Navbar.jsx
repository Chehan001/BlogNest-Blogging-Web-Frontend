import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Search, Bell, User, Settings, LogOut, PlusCircle, FileText } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  // Replace with actual auth context
  const [user, setUser] = useState(null); // Set to { name: "John Doe", email: "john@example.com" } for testing
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // Example notification count

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set active link based on current path
  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.navbar-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    // Implement logout logic
    setUser(null);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.location.href = '/';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
    closeMobileMenu();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const userLinks = [
    { path: '/add-blog', label: 'Add Blog', icon: PlusCircle },
    { path: '/my-posts', label: 'My Posts', icon: FileText },
  ];

  const dropdownItems = [
    { label: 'Profile', icon: User, action: () => window.location.href = '/profile' },
    { label: 'Settings', icon: Settings, action: () => window.location.href = '/settings' },
    { label: 'Logout', icon: LogOut, action: handleLogout },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <a 
            href="/" 
            className="navbar-logo"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/');
              window.location.href = '/';
            }}
          >
            <div className="navbar-logo-wrapper">
              <div className="navbar-logo-glow"></div>
              <div className="navbar-logo-box">
                <BookOpen className="navbar-logo-icon" />
              </div>
            </div>
            <span className="navbar-logo-text">BlogHub</span>
          </a>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            {/* Main Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`navbar-link ${activeLink === link.path ? 'navbar-link-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.path);
                  window.location.href = link.path;
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Search Bar (Desktop only) */}
            <div className="navbar-search">
              <Search className="navbar-search-icon" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input"
              />
            </div>

            {/* User Navigation */}
            {user ? (
              <>
                {userLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    className={`navbar-link ${activeLink === link.path ? 'navbar-link-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.path);
                      window.location.href = link.path;
                    }}
                  >
                    {link.label}
                  </a>
                ))}

                {/* Notifications */}
                <button
                  className="navbar-link"
                  style={{ position: 'relative' }}
                  onClick={() => console.log('Open notifications')}
                >
                  <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
                  {notifications > 0 && (
                    <span className="navbar-notification-badge">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="navbar-dropdown">
                  <button
                    onClick={toggleDropdown}
                    className="navbar-user-avatar"
                    aria-label="User menu"
                  >
                    {getInitials(user.name)}
                  </button>

                  {dropdownOpen && (
                    <div className="navbar-dropdown-menu">
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #334155', marginBottom: '0.5rem' }}>
                        <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.125rem' }}>
                          {user.name || 'User'}
                        </p>
                        <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                          {user.email || 'user@example.com'}
                        </p>
                      </div>
                      {dropdownItems.map((item, index) => (
                        <React.Fragment key={item.label}>
                          {index === dropdownItems.length - 1 && (
                            <div className="navbar-dropdown-divider"></div>
                          )}
                          <button
                            onClick={item.action}
                            className="navbar-dropdown-item"
                          >
                            <item.icon className="navbar-dropdown-icon" />
                            {item.label}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <a
                href="/login"
                className="navbar-btn navbar-btn-login"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('/login');
                  window.location.href = '/login';
                }}
              >
                Login
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="navbar-mobile-toggle"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="navbar-mobile-toggle-icon" />
            ) : (
              <Menu className="navbar-mobile-toggle-icon" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-menu-content">
            {/* User Info (Mobile) */}
            {user && (
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: '#1e293b', 
                borderRadius: '0.5rem', 
                marginBottom: '0.5rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="navbar-user-avatar">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.125rem' }}>
                      {user.name || 'User'}
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      {user.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.path);
                  window.location.href = link.path;
                }}
                className={`navbar-mobile-link ${activeLink === link.path ? 'navbar-mobile-link-active' : ''}`}
              >
                {link.label}
              </a>
            ))}

            {/* User Links (Mobile) */}
            {user ? (
              <>
                {userLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.path);
                      window.location.href = link.path;
                    }}
                    className={`navbar-mobile-link ${activeLink === link.path ? 'navbar-mobile-link-active' : ''}`}
                  >
                    <link.icon style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                    {link.label}
                  </a>
                ))}

                {/* Notifications (Mobile) */}
                <button
                  onClick={() => {
                    console.log('Open notifications');
                    closeMobileMenu();
                  }}
                  className="navbar-mobile-link"
                  style={{ position: 'relative', textAlign: 'left', width: '100%', border: 'none', background: 'none' }}
                >
                  <Bell style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  Notifications
                  {notifications > 0 && (
                    <span className="navbar-notification-badge" style={{ position: 'static', marginLeft: '0.5rem' }}>
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </button>

                {/* Profile & Settings (Mobile) */}
                <a
                  href="/profile"
                  onClick={(e) => {
                    e.preventDefault();
                    closeMobileMenu();
                    window.location.href = '/profile';
                  }}
                  className="navbar-mobile-link"
                >
                  <User style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  Profile
                </a>
                <a
                  href="/settings"
                  onClick={(e) => {
                    e.preventDefault();
                    closeMobileMenu();
                    window.location.href = '/settings';
                  }}
                  className="navbar-mobile-link"
                >
                  <Settings style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  Settings
                </a>

                <button
                  onClick={handleLogout}
                  className="navbar-mobile-btn-logout"
                >
                  <LogOut style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('/login');
                  window.location.href = '/login';
                }}
                className="navbar-mobile-btn-login"
              >
                Login
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;