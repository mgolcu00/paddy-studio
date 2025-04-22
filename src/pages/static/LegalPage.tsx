import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Footer } from '@/pages/landing/Footer';
import { useAuth } from '@/context/AuthContext';

interface LegalContentProps {
  type: 'privacy' | 'terms';
}

function LegalContent({ type }: LegalContentProps) {
  if (type === 'privacy') {
    return (
      <>
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <p className="mb-4">Last updated: May 1, 2025</p>
        
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            At Paddy Studio, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Create an account</li>
            <li>Use our services</li>
            <li>Contact our support team</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Develop new products and services</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p>
            Depending on your location, you may have rights related to your personal information, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Accessing, correcting, or deleting your data</li>
            <li>Withdrawing consent</li>
            <li>Data portability</li>
            <li>Restricting processing</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@paddystudio.com.
          </p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <p className="mb-4">Last updated: May 1, 2025</p>
        
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Paddy Studio service, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>
            Paddy Studio provides a no-code UI builder web application that allows users to create, customize, and export user interfaces.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            To use certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. User Content</h2>
          <p>
            You retain all rights to any content you create, upload, or share on the Service. By uploading content to the Service, you grant us a license to use, modify, and display that content as necessary to provide the Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Prohibited Uses</h2>
          <p>
            You agree not to use the Service for any unlawful purpose or in a way that could damage, disable, or impair the Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users of the Service, us, or third parties, or for any other reason.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" without warranties of any kind, either express or implied.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at legal@paddystudio.com.
          </p>
        </div>
      </>
    );
  }
}

export function LegalPage() {
  const { type } = useParams<{ type: string }>();
  const { currentUser } = useAuth();
  
  const legalType = type === 'privacy-policy' ? 'privacy' : 'terms';
  const pageTitle = legalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service';

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

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <LegalContent type={legalType} />
        </div>
      </main>

      <Footer />
    </div>
  );
}