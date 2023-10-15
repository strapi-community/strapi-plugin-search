import React from "react";
import { Button } from "@strapi/design-system";
import StyledTable from "../StyledTable";

const action = <Button variant="secondary">Re-Index</Button>;

const IndexOverview = () => {
	return (
		<StyledTable
			data={[
				{
					Index: "blog",
					Engine: "Elasticsearch",
					Documents: 15,
				},
				{
					Index: "page",
					Engine: "Elasticsearch",
					Documents: 2,
				},
				{
					Index: "post",
					Engine: "Elasticsearch",
					Documents: 15,
				},
				{
					Index: "product",
					Engine: "Elasticsearch",
					Documents: 2,
				},
			]}
			action={action}
		/>
	);
};

export default IndexOverview;
