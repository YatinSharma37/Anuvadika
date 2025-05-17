import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Terms', path: '/terms' },
    { label: 'Privacy', path: '/privacy' },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  ];

  return (
    <footer className="bg-light-100 dark:bg-dark-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link to="/" className="text-2xl font-bold text-primary mb-2">
              Anuvadika
            </Link>
            <p className="text-dark-300 dark:text-light-300 text-sm">
              Break Language Barriers.<br />Generate Subtitles Instantly.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold mb-2 text-dark-400 dark:text-light-200">
              Quick Links
            </h3>
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-dark-300 dark:text-light-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-dark-400 dark:text-light-200">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-300 dark:text-light-300 hover:text-primary dark:hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-light-300 dark:border-dark-300">
          <p className="text-center text-sm text-dark-300 dark:text-light-300">
            © {currentYear} Anuvadika. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}; 