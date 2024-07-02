import Layout from "@/app/components/Layout";
import { useAuth } from "@/app/utils/authContext";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div>
        <h1>Profile</h1>
        <p>User Name: {user.username}</p>
        <p>
          Name: {user.first_name} {user.last_name}
        </p>
        <p>Email: {user.email}</p>
        <p>Birth Day: {user.date_of_birth}</p>
      </div>
    </Layout>
  );
};

export default Profile;
