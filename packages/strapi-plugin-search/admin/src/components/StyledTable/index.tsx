import React from "react";
import {
	Table,
	Thead,
	Tr,
	Th,
	Typography,
	Tbody,
	Td,
	VisuallyHidden,
	Flex,
} from "@strapi/design-system";

import styled from "styled-components";

const TableWrapper = styled.div`
  div {
    border: none;
    box-shadow: none;
  }
`;

const CustomTable = styled(Table)`
  tr,
  td {
    border-bottom-width: 2px;
  }
`;

const StyledTable = ({
	data,
	action,
}: {
  data: {
    [key: string]: string | number;
  }[];
  action: JSX.Element;
}) => {
	return (
		<TableWrapper>
			<CustomTable>
				<Thead>
					<Tr>
						{Object.keys(data[0]).map((key) => (
							<Th key={key}>
								<Typography variant="beta">{key}</Typography>
							</Th>
						))}
						{action && (
							<Th>
								<VisuallyHidden>Actions</VisuallyHidden>
							</Th>
						)}
					</Tr>
				</Thead>
				<Tbody>
					{data.map((row: {[key:string]:string|number|boolean}, index: number) => (
						<Tr key={index}>
							{Object.keys(row).map((key) => (
								<Td key={key}>
									<Typography variant="sigma">{row[key]}</Typography>
								</Td>
							))}
							{action && (
								<Td>
									<Flex justifyContent="flex-end">{action}</Flex>
								</Td>
							)}
						</Tr>
					))}
				</Tbody>
			</CustomTable>
		</TableWrapper>
	);
};

export default StyledTable;
