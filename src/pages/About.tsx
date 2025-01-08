import { Layout } from "@/components/Layout";

export const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">About AntiApp</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            AntiApp is dedicated to helping people find and enjoy the perfect workspace environment. 
            We connect users with cafes and coworking spaces that match their needs, whether they're 
            looking for a quiet spot to focus or a vibrant atmosphere to collaborate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Find Spaces</h3>
                <p className="text-gray-700">
                  Search for cafes and workspaces based on location, amenities, and atmosphere.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Book & Check In</h3>
                <p className="text-gray-700">
                  Reserve your spot and check in easily when you arrive.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Connect</h3>
                <p className="text-gray-700">
                  Message cafe owners directly and join our community of remote workers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            Have questions or suggestions? We'd love to hear from you. Reach out to our support 
            team through the messaging feature in the app.
          </p>
        </section>
      </div>
    </Layout>
  );
};