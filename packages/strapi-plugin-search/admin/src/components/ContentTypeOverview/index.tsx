import React from "react";
import { Button } from "@strapi/design-system";
import StyledTable from "../StyledTable";

const action = <Button variant="secondary">Re-Index</Button>;

const CTOverview = () => {
	return (
		<StyledTable
			data={[
				{
					"Content Type": "Blog",
					Index: "blog",
					Engine: "Elasticsearch",
					Documents: 15,
				},
				{
					"Content Type": "Page",
					Index: "page",
					Engine: "Elasticsearch",
					Documents: 2,
				},
				{
					"Content Type": "Post",
					Index: "post",
					Engine: "Elasticsearch",
					Documents: 15,
				},
				{
					"Content Type": "Product",
					Index: "product",
					Engine: "Elasticsearch",
					Documents: 2,
				},
			]}
			action={action}
		/>
	);
};

export default CTOverview;
