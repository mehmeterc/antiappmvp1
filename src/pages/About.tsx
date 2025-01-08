import { Layout } from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About AntiApp</h1>
        <div className="prose prose-lg">
          <p className="text-lg leading-relaxed mb-6">
            Welcome to AntiApp, your go-to platform for discovering and connecting with the best cafes tailored for work, study, and unwinding.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed mb-6">
            At AntiApp, we aim to build a vibrant community where remote workers, students, and cafe lovers can find their ideal third place—a space beyond home and office designed for productivity and relaxation.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Handpicked listings of cafes and work-friendly spaces</li>
            <li>Real-time tracking of space availability</li>
            <li>Community-driven reviews and ratings</li>
            <li>Easy-to-use booking system</li>
            <li>Exclusive deals and promotions</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">For Cafe Owners</h2>
          <p className="text-lg leading-relaxed mb-6">
            Partner with AntiApp to enhance your visibility, optimize space management, and engage with a community of individuals seeking high-quality, productive environments for work and leisure.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Follow Us on Instagram</h2>
          <p className="text-lg leading-relaxed mb-6">
            Stay updated on the latest cafe discoveries, exclusive deals, and community highlights! Follow us at{" "}
            <a 
              href="https://www.instagram.com/antiapp.berlin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @antiapp.berlin
            </a>
            {" "}and join the conversation.
          </p>
          
          <p className="text-lg font-semibold mt-8">
            Discover your next favorite space with AntiApp!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;