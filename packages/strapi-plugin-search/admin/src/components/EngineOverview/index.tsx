import React from "react";
import { Button } from "@strapi/design-system";
import StyledTable from "../StyledTable";

const action = <Button variant="secondary">Re-Index</Button>;

const EngineOverview = () => {
  return (
    <StyledTable
      data={[
        {
          Engine: "Elasticsearch",
          Documents: 15,
        },
      ]}
      action={action}
    />
  );
};

export default EngineOverview;
