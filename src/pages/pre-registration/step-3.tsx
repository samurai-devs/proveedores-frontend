import {
	Stack,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Select,
	Textarea,
	Button,
	Flex,
	Box,
	Heading,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useColorModeValue } from "@chakra-ui/react";

const StepThree = () => {
	const formik = useFormik({
		initialValues: {
			payment_method: "",
			bank: "",
			currency: "",
			account_type: "",
			account_number: "",
			beneficiary: "",
			document_number: "",
			observation: "",
		},
		validationSchema: Yup.object({
			payment_method: Yup.string().required(
				"El metodo de pago es requerido"
			),
			bank: Yup.string().required("El banco es requerido"),
			currency: Yup.string().required("La moneda es requerida"),
			account_type: Yup.string().required(
				"El tipo de cuenta es requerida"
			),
			account_number: Yup.string().required(
				"El número de cuenta es requerido"
			),
			beneficiary: Yup.string().required("El beneficiario es requerido"),
			document_number: Yup.string().required(
				"El número de documento es requerido"
			),
			observation: Yup.string().required("La observación es requerida"),
		}),
		onSubmit: async (data) => {
			alert(data);
		},
	});

	const paymentMethods = [
		{
			id: 1,
			name: "Efectivo",
		},
		{
			id: 2,
			name: "Transferencia",
		},
	];
	const banks = [
		{
			id: 1,
			name: "Banco de Venezuela",
		},
		{
			id: 2,
			name: "Banco Mercantil",
		},
	];
	const currencies = [
		{
			id: 1,
			name: "Bolívares",
		},
		{
			id: 2,
			name: "Dólares",
		},
	];

	const accountTypes = [
		{
			id: 1,
			name: "Corriente",
		},
	];

	return (
		<>
			<Flex
				minH={"100vh"}
				align={"center"}
				justify={"center"}
				bg={useColorModeValue("gray.50", "gray.800")}
			>
				<Stack
					spacing={6}
					mx={"auto"}
					maxW={"lg"}
					py={12}
					px={6}
					width={"80%"}
				>
					<Stack align={"center"}>
						<Heading fontSize={"4xl"}>Pre Registro Paso 3</Heading>
					</Stack>
					<Box
						rounded={"lg"}
						bg={useColorModeValue("white", "gray.700")}
						boxShadow={"lg"}
						p={8}
						width='100%'
					>
						<form onSubmit={formik.handleSubmit}>
							<Stack spacing={4} marginBottom={4}>
								<FormControl
									id='payment_method'
									isInvalid={
										formik.errors.payment_method &&
										formik.errors.payment_method
											? true
											: false
									}
								>
									<FormLabel>Formas de pago </FormLabel>
									<Select
										placeholder='Select option'
										value={formik.values.payment_method}
										onChange={formik.handleChange}
									>
										{paymentMethods.map((paymentMethod) => (
											<option
												value={paymentMethod.id}
												key={paymentMethod.id}
											>
												{paymentMethod.name}
											</option>
										))}
									</Select>
									<FormErrorMessage>
										{formik.touched.payment_method &&
											formik.errors.payment_method}
									</FormErrorMessage>
								</FormControl>
								<FormControl
									id='bank'
									isInvalid={
										formik.touched.bank &&
										formik.errors.bank
											? true
											: false
									}
								>
									<FormLabel>Banco</FormLabel>

									<Select
										placeholder='Select option'
										value={formik.values.bank}
										onChange={formik.handleChange}
									>
										{banks.map((bank) => (
											<option
												value={bank.id}
												key={bank.id}
											>
												{bank.name}
											</option>
										))}
									</Select>

									<FormErrorMessage>
										{formik.touched.bank &&
											formik.errors.bank}
									</FormErrorMessage>
								</FormControl>

								<FormControl
									id='currency'
									isInvalid={
										formik.errors.currency &&
										formik.errors.currency
											? true
											: false
									}
								>
									<FormLabel>Moneda</FormLabel>
									<Select
										placeholder='Select option'
										value={formik.values.currency}
										onChange={formik.handleChange}
									>
										{currencies.map((currency) => (
											<option
												value={currency.id}
												key={currency.id}
											>
												{currency.name}
											</option>
										))}
									</Select>

									<FormErrorMessage>
										{formik.touched.currency &&
											formik.errors.currency}
									</FormErrorMessage>
								</FormControl>

								<FormControl
									id='account_type'
									isInvalid={
										formik.errors.account_type &&
										formik.errors.account_type
											? true
											: false
									}
								>
									<FormLabel>Tipo de cuenta</FormLabel>
									<Select
										placeholder='Select option'
										value={formik.values.account_type}
										onChange={formik.handleChange}
									>
										{accountTypes.map((accountType) => (
											<option
												value={accountType.id}
												key={accountType.id}
											>
												{accountType.name}
											</option>
										))}
									</Select>

									<FormErrorMessage>
										{formik.touched.account_type &&
											formik.errors.account_type}
									</FormErrorMessage>
								</FormControl>

								<FormControl
									id='account_number'
									isInvalid={
										formik.errors.account_number &&
										formik.errors.account_number
											? true
											: false
									}
								>
									<FormLabel>Numero de cuenta</FormLabel>
									<Input
										type='text'
										value={formik.values.account_number}
										onChange={formik.handleChange}
									/>

									<FormErrorMessage>
										{formik.touched.account_number &&
											formik.errors.account_number}
									</FormErrorMessage>
								</FormControl>

								<FormControl
									id='beneficiary'
									isInvalid={
										formik.errors.beneficiary &&
										formik.errors.beneficiary
											? true
											: false
									}
								>
									<FormLabel>Beneficiario</FormLabel>
									<Input
										type='text'
										value={formik.values.beneficiary}
										onChange={formik.handleChange}
									/>
									<FormErrorMessage>
										{formik.touched.beneficiary &&
											formik.errors.beneficiary}
									</FormErrorMessage>
								</FormControl>

								<FormControl
									id='document_number'
									isInvalid={
										formik.errors.document_number
											? true
											: false
									}
								>
									<FormLabel>CI / RIF</FormLabel>
									<Input
										type='text'
										value={formik.values.document_number}
										onChange={formik.handleChange}
									/>
									<FormErrorMessage>
										{formik.touched.document_number &&
											formik.errors.document_number}
									</FormErrorMessage>
								</FormControl>

								<FormControl
									id='observation'
									isInvalid={
										formik.errors.observation &&
										formik.errors.observation
											? true
											: false
									}
								>
									<FormLabel>Observacion</FormLabel>
									<Textarea
										placeholder='Escribe tu observación o comentario'
										value={formik.values.observation}
										onChange={formik.handleChange}
									/>
									<FormErrorMessage>
										{formik.touched.observation &&
											formik.errors.observation}
									</FormErrorMessage>
								</FormControl>
							</Stack>

							<Stack direction={"row"} spacing={4} marginTop={4}>
								<Button
									bg={"brand.400"}
									color={"white"}
									_hover={{
										bg: "brand.500",
									}}
									type='submit'
								>
									Guardar
								</Button>
							</Stack>
						</form>
					</Box>
				</Stack>
			</Flex>
		</>
	);
};
export default StepThree;