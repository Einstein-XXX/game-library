import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-gray-400 mt-auto border-t border-gray-900">
      <div className="max-w-[1920px] mx-auto px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Games */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Games</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Fortnite</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fall Guys</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rocket League</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Unreal Tournament</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shadow Complex</a></li>
            </ul>
          </div>

          {/* Marketplaces */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Marketplaces</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Game Store</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Fab</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sketchfab</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ArtStation</a></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Tools</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Unreal Engine</a></li>
              <li><a href="#" className="hover:text-white transition-colors">UEFN</a></li>
              <li><a href="#" className="hover:text-white transition-colors">MetaHuman</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twinmotion</a></li>
              <li><a href="#" className="hover:text-white transition-colors">RealityScan</a></li>
            </ul>
          </div>

          {/* Online Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Online Services</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Epic Online Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kids Web Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Services Agreement</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Students</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Dev Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community Rules</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fan Art Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-6 mb-8">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <span>© 2025 GameLibrary. All Rights Reserved.</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Store Refund Policy</a>
            </div>
            <div className="text-xs text-gray-500">
              Powered by <a href="https://rawg.io/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">RAWG API</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
