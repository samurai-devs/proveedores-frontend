import { ChevronRightIcon } from "@chakra-ui/icons";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Text,
} from "@chakra-ui/react";

import { useAuth } from "@/hooks/auth";
import Hero from "@/components/Hero";

const dashboard = () => {
	const { user } = useAuth({ middleware: "auth" });

	return (
		<>
			<Breadcrumb
				spacing='8px'
				separator={<ChevronRightIcon color='gray.500' />}
			>
				<BreadcrumbItem>
					<BreadcrumbLink href='dashboard'>
						{" "}
						<Text fontSize='2xl'>Inicio</Text>
					</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>

			<Hero />
			{/* <pre>{JSON.stringify(user, null, 2) ?? "Espere..."}</pre> */}
		</>
	);
};

export default dashboard;
