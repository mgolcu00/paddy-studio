import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react'; // Example social icons

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 inline-block">Paddy Studio</Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Kod yazmadan harika arayüzler oluşturun. Kolayca sürükleyin, bırakın ve tasarlayın.
            </p>
            {/* Social Media Links with aria-label for SEO/Accessibility */}
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Paddy Studio on Github" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Github className="h-5 w-5" />
              </a>
               <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Paddy Studio on Twitter" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
               <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Paddy Studio on Linkedin" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="lg:col-span-1">
            <h3 className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ürün</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Özellikler
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Yol Haritası
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-300 uppercase tracking-wider">Kaynaklar</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Dokümantasyon
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Eğitimler
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <h3 className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-300 uppercase tracking-wider">Yasal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Hizmet Şartları
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Paddy Studio. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}