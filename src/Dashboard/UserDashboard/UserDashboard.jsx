
import { Route, Switch, Redirect } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Navbar from './Navbar';
// import AddPet from './AddPet';
// import MyAddedPets from './MyAddedPets';
// import AdoptionRequest from './AdoptionRequest';
// import CreateDonationCampaign from './CreateDonationCampaign';
// import MyDonationCampaigns from './MyDonationCampaigns';
// import MyDonations from './MyDonations';

const UserDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <Switch>
            <Route path="/dashboard/add-pet" component={AddPet} />
            <Route path="/dashboard/my-added-pets" component={MyAddedPets} />
            <Route path="/dashboard/adoption-request" component={AdoptionRequest} />
            <Route path="/dashboard/create-donation-campaign" component={CreateDonationCampaign} />
            <Route path="/dashboard/my-donation-campaigns" component={MyDonationCampaigns} />
            <Route path="/dashboard/my-donations" component={MyDonations} />
            <Redirect from="/dashboard" to="/dashboard/add-pet" />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
