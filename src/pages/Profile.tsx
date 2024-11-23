import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Clock, MapPin } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <User className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-gray-600">john.doe@example.com</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Last visit: St. Oberholz (2 days ago)
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                Favorite area: Mitte
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/saved")}
              >
                View Saved Cafes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/search")}
              >
                Find New Spaces
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;