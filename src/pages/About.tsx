import { Layout } from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Cozy Cafe Connect</h1>
        <div className="prose prose-lg">
          <p>
            Welcome to Cozy Cafe Connect, your ultimate platform for discovering and connecting with the perfect spaces for work, study, and relaxation.
          </p>
          <h2>Our Mission</h2>
          <p>
            We believe in creating a community where remote workers, students, and cafe enthusiasts can find their ideal third place - a space between home and work where they can thrive.
          </p>
          <h2>What We Offer</h2>
          <ul>
            <li>Curated selection of cafes and workspaces</li>
            <li>Real-time occupancy tracking</li>
            <li>Community reviews and ratings</li>
            <li>Seamless booking system</li>
            <li>Special deals and promotions</li>
          </ul>
          <h2>For Cafe Owners</h2>
          <p>
            Join our platform to increase visibility, manage your space efficiently, and connect with a community of potential customers who value quality spaces for work and relaxation.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;