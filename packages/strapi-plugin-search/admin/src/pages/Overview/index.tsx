import React from "react";
import {
  Tabs,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
  Box,
  HeaderLayout,
} from "@strapi/design-system";
import CTOverview from "../../components/ContentTypeOverview";
import IndexOverview from "../../components/IndexOverview";
import EngineOverview from "../../components/EngineOverview";

const Overview = () => {
  return (
    <>
      <HeaderLayout
        title="Search Overview"
        subtitle="Overview of searchable items"
        as="h1"
      />
      <Box
        style={{
          padding: "0 3rem",
        }}
        background="primary100"
      >
        <TabGroup
          label="Some stuff for the label"
          id="tabs"
          onTabChange={(selected: any) => console.log(selected)}
        >
          <Tabs>
            <Tab>Content Type</Tab>
            <Tab>Index</Tab>
            <Tab>Engine</Tab>
          </Tabs>
          <TabPanels>
            <TabPanel>
              <Box color="neutral800" padding={4} background="neutral0">
                <CTOverview />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box color="neutral800" padding={4} background="neutral0">
                <IndexOverview />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box color="neutral800" padding={4} background="neutral0">
                <EngineOverview />
              </Box>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Box>
    </>
  );
};

export default Overview;
