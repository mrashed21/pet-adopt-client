import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ReceiveRequest from "./ReceiveRequest/ReceiveRequest";
import SendRequest from "./SendRequest/SendRequest";
const AdoptRequest = () => {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Send</Tab>
          <Tab>Receive</Tab>
        </TabList>

        <TabPanel>
          <SendRequest />
        </TabPanel>
        <TabPanel>
          <ReceiveRequest />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AdoptRequest;
