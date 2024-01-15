import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./dashboard.css";  // Import the CSS file
import RequestsCard from "./RequestsCard";
import EventsCard from "./EventsCard";
import UsersCard from "./UsersCard";
import Navigation from "./Navigation";

const DashboardForm = () => {
  const router = useRouter();

  return (
    <div>
        <Navigation />
      {/* Add content for each page here */}

      <div className="dashboard-cards-container">
        <RequestsCard />
        <EventsCard />
        <UsersCard />
      </div>

    </div>
  );
};

export default DashboardForm;
