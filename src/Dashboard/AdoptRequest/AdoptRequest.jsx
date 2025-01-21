import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ReceiveRequest from "./ReceiveRequest/ReceiveRequest";
import SendRequest from "./SendRequest/SendRequest";
const AdoptRequest = () => {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Receive</Tab>
          <Tab>Send</Tab>
        </TabList>

        <TabPanel>
          <ReceiveRequest />
        </TabPanel>
        <TabPanel>
          <SendRequest />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AdoptRequest;
