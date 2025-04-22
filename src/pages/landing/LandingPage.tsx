import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function LandingPage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950/50">
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex justify-between items-center py-3 px-4 md:px-6">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">Paddy Studio</Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Docs
            </Link>
          </nav>
          <div className="flex items-center space-x-2 md:space-x-4">
            {currentUser ? (
              <Button asChild size="sm">
                <Link to="/console">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth?mode=login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}