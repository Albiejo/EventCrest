import { Routes, Route } from "react-router-dom";
import ChangePassword from "../../components/user/Profile/ChangePassword";
import Favorites from "../../components/user/Profile/Favorites";
import UserSidebar from "../../components/user/Profile/Sidebar";
import  ProfileCard  from "../../components/user/Profile/ProfileCard";

const Profile = () => {
  return (
    <div style={{ display: 'flex' }}>
      <UserSidebar />
      <div style={{ marginLeft: '200px', flex: 1 ,marginTop:"50px"}}>
        <Routes>
          <Route path="/" element={<ProfileCard />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="profile/Favorites" element={<Favorites />} />
        </Routes>
      </div>
    </div>
  );
};

export default Profile;