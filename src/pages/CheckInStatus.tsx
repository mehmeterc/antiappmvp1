import { Layout } from "@/components/Layout";
import CheckInStatusComponent from "@/components/check-in/CheckInStatus";
import { useParams } from "react-router-dom";

const CheckInStatus = () => {
  const { id } = useParams();

  if (!id) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No cafe selected
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CheckInStatusComponent cafeId={id} />
    </Layout>
  );
};

export default CheckInStatus;