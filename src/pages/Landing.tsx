
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowRight, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LandingPage = () => {
  useEffect(() => {
    // Set meta tags dynamically
    document.title = "AntiApp - Find Your Perfect Third Place";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Discover cafes, libraries, and community spaces perfect for remote work and connection.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AntiApp</span>
          </div>
          <Button asChild>
            <Link to="/login" className="flex items-center gap-2">
              Launch App <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 animate-fade-in">
            Find Your Perfect Third Place
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 animate-fade-in">
            Discover cafes, libraries, and community spaces perfect for remote work and connection.
          </p>
          <Button size="lg" asChild className="animate-fade-in">
            <Link to="/search" className="flex items-center gap-2">
              Explore Spaces <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Find Perfect Spaces",
              description: "Discover workspace-friendly cafes and community spaces near you."
            },
            {
              title: "Real-time Availability",
              description: "Check current occupancy and amenities before you visit."
            },
            {
              title: "Connect & Share",
              description: "Join a community of remote workers and share your favorite spots."
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className={cn(
                "p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ready to find your next favorite spot?
          </h2>
          <p className="text-xl text-gray-600">
            Join our community of remote workers and space seekers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/search">Browse Spaces</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AntiApp</span>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://instagram.com/antiapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} AntiApp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
