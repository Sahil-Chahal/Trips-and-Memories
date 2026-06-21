import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage.jsx";
import Register from './Pages/Register.jsx';
import Login from './Pages/Login.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import ResetPassword from './Pages/ResetPassword.jsx';
import NotFound from './Pages/NotFound.jsx';
import Denied from "./Pages/Denied.jsx";
import Profile from "./Pages/Profile.jsx";
import ChangePassword from "./Pages/ChangePassword.jsx";
import CreateMemory from "./Pages/Memory/CreateMemory.jsx";
import PersonalMemories from "./Pages/Memory/PersonalMemories.jsx";
import AllMemories from "./Pages/Memory/AllMemories.jsx";
import ViewMemory from "./Pages/Memory/ViewMemory.jsx";

import BucketList from "./Pages/BucketList/BucketList.jsx";
import FriendProfile from "./Pages/Friends/FriendProfile.jsx";
import AllFriends from "./Pages/Friends/AllFriends.jsx";
import TripsRecomm from "./Pages/Recommendations/TripsRecomm.jsx";
import CreateTimeCapsule from "./Pages/TimeCapsule/CreateTimeCapsule.jsx";
import PersonalTimeCapsules from "./Pages/TimeCapsule/PersonalTimeCapsules.jsx";
import ViewTimeCapsule from "./Pages/TimeCapsule/ViewTimeCapsule.jsx";
import CreateJournal from "./Pages/journal/CreateJournal.jsx";
import MyJournals from "./Pages/journal/MyJournals.jsx";
import AddEntry from "./Pages/journal/AddEntry.jsx";
import ViewJournal from "./Pages/journal/ViewJournal.jsx";
import ManageContributors from "./Components/journal/ManageContributors.jsx";

import RequireAuth from "./Helpers/RequireAuth.jsx";
import Dashboard from "./Pages/Admin/Dashboard.jsx";


function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/modal/check" element={<ManageContributors/>}></Route>
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/forgot-password' element={<ForgotPassword />} />
        <Route path='/auth/reset/:resetToken' element={<ResetPassword />} />


        <Route path="/user/me/profile" element={<Profile/>}></Route>
        <Route path="users/friends-list" element={<AllFriends/>}></Route>
        <Route path="users/friends-list/friend-profile/:friendId/:friendStatus" element={<FriendProfile/>}></Route>

        <Route path="/denied" element={<Denied />} > </Route>
        <Route path="/auth/change-password" element={<ChangePassword/>} ></Route>

        


        <Route element={<RequireAuth allowedRoles={['USER', 'ADMIN']} />}>
            <Route path="/get-recomm" element={<TripsRecomm/>}></Route>
            <Route path="/time-capsules/create" element={<CreateTimeCapsule/>}></Route>
            <Route path="/time-capsules/my" element={<PersonalTimeCapsules/>}></Route>
            <Route path="/time-capsules/view/:capsuleId" element={<ViewTimeCapsule/>}></Route>
            <Route path="/create-journal" element={<CreateJournal/>}></Route> 
            <Route path="/my-journals" element={<MyJournals/>}></Route>
            <Route path="/add-entry/:journalId" element={<AddEntry/>}></Route>
            <Route path="/view-journal/:journalId" element={<ViewJournal/>}></Route>
            <Route path="/manage-contributors/:journalId" element={<ManageContributors/>}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<Dashboard/>}></Route>
        </Route>


        <Route path="/memory/all" element={<AllMemories/>}></Route>

        <Route element={<RequireAuth allowedRoles={['USER', 'ADMIN']}/>}>
            <Route path="/memory/create-memory" element={<CreateMemory/>} ></Route>
            <Route path="/memory/my" element={<PersonalMemories/>}></Route>
            <Route path="/memory/:memoryId" element={<ViewMemory/>}></Route>
            <Route path="/my-bucket-list" element={<BucketList/>}></Route>
        </Route>

        <Route path='*' element={<NotFound />} />


      </Routes>
    </>
  );
}

export default App;
