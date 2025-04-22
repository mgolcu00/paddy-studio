import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';
import { Footer } from '@/pages/landing/Footer';
import { useAuth } from '@/context/AuthContext';

export function PricingPage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4 px-4 md:px-6 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Paddy Studio</Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/docs" className="text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors">
              Docs
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <Button asChild>
                <Link to="/console">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/auth?mode=login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-24">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Pricing Plans</h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-[800px] mx-auto">
                Choose the perfect plan for your needs. All plans include basic features with additional benefits as you scale.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {/* Free Plan */}
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-8 transition duration-200 hover:shadow-md flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-1">Free</h3>
                  <div className="text-3xl font-bold mb-2">$0<span className="text-base font-normal text-gray-500">/month</span></div>
                  <p className="text-gray-500 dark:text-gray-400">Perfect for trying out the platform</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Up to 3 projects</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic components</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Community support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>JSON export</span>
                  </li>
                </ul>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-white dark:bg-gray-950 border-2 border-purple-500 rounded-lg shadow-sm p-8 transition duration-200 hover:shadow-md flex flex-col relative">
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-1">Pro</h3>
                  <div className="text-3xl font-bold mb-2">$19<span className="text-base font-normal text-gray-500">/month</span></div>
                  <p className="text-gray-500 dark:text-gray-400">Best for professionals and teams</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced components</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Custom themes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Team collaboration</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full">
                  <Link to="/auth?mode=signup">Choose Pro</Link>
                </Button>
              </div>
              
              {/* Enterprise Plan */}
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-8 transition duration-200 hover:shadow-md flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-1">Enterprise</h3>
                  <div className="text-3xl font-bold mb-2">$49<span className="text-base font-normal text-gray-500">/month</span></div>
                  <p className="text-gray-500 dark:text-gray-400">For large teams and organizations</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced security</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited team members</span>
                  </li>
                </ul>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold mb-4">Need something custom?</h3>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 max-w-[600px] mx-auto">
                We offer custom solutions for large enterprises. Contact us to discuss your specific needs.
              </p>
              <Button asChild size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}