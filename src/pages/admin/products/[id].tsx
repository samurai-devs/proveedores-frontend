import { useRouter } from "next/router";
import { useAuth } from "@/hooks/auth";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Button,
	Center,
	Flex,
	Grid,
	GridItem,
	Input,
	InputGroup,
	InputRightElement,
	useColorModeValue,
	Text,
	Square,
	Box,
	HStack,
	Stack,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Select,
	useToast,
	SimpleGrid,
	Image,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link } from "@chakra-ui/react";
import api from "@/lib/api";
import { getToken } from "@/services/local-storage.service";
import { useEffect, useState } from "react";
import { IProducts } from "@/interfaces/product.interface";
import { HttpStatusCode } from "@/app/common/enums/httpStatusCode";
import { IOptions } from "@/interfaces/options.interface";

import {
	getCategoryOptions,
	getSpecialPaymentMethodsOptions,
	getConditionsOptions,
	getCurrencyOptions,
} from "@/services/options.service";

const edit = () => {
	const { user } = useAuth({ middleware: "auth" });
	const router = useRouter();
	const { id } = router.query;

	const token = getToken();

	const toast = useToast();

	const [categories, setCategories] = useState([]);
	const [specialPaymentMethods, setSpecialPaymentMethods] = useState([]);
	const [conditions, setConditions] = useState([]);
	const [currencies, setCurrencies] = useState([]);

	const loadSelects = async () => {
		await getCategoryOptions(setCategories);
		await getSpecialPaymentMethodsOptions(setSpecialPaymentMethods);
		await getConditionsOptions(setConditions);
		await getCurrencyOptions(setCurrencies);
	};

	useEffect(() => {
		loadSelects();
	}, []);
	const isDisabled = true;

	const [product, setProduct] = useState<IProducts>({} as IProducts);

	const getProduct = async (productId: any) => {
		const response = await api.get(`store/${productId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		setProduct(response.data.data);
	};

	useEffect(() => {
		if (id) {
			getProduct(id);
		}
	}, [id]);

	if (!product) return <div> Espere... </div>;

	const formik = useFormik({
		initialValues: {
			name: product.name ? product.name : "",
			category_id: product.category ? product.category : "",
			sku: product.sku_provider ? product.sku_provider : "",
			barcode: product.bar_code ? product.bar_code : "",
			special_payment_method: "",
			condition: product.condition ? product.condition : "",
			currency: product.currency ? product.currency : "",
			packing_quantity: product.units ? product.units : "",
			quantity_available: "",
			bulk_cost: product.cost_per_package ? product.cost_per_package : "",
			unit_price: product.cost_per_unit ? product.cost_per_unit : "",
			// files: [],
		},
		validationSchema: Yup.object({
			name: Yup.string().required("El nombre es obligatorio"),
			category_id: Yup.number().required("La categoría es obligatoria"),
			sku: Yup.string().required("El SKU es obligatorio"),
			barcode: Yup.string().required(
				"El código de barras es obligatorio"
			),
			special_payment_method: Yup.number().required(
				"El método de pago es obligatorio"
			),
			condition: Yup.number().required("La condición es obligatoria"),
			currency: Yup.number().required("La moneda es obligatoria"),
			packing_quantity: Yup.number().required(
				"La cantidad de empaque es obligatoria"
			),
			quantity_available: Yup.number().required(
				"La cantidad disponible es obligatoria"
			),
			bulk_cost: Yup.number().required(
				"El costo por lote es obligatorio"
			),
			unit_price: Yup.number().required(
				"El precio unitario es obligatorio"
			),
			// files: Yup.array().min(1,"Carga al menos una imagen"),
		}),
		enableReinitialize: true,
		onSubmit: async ({
			name,
			category_id,
			sku,
			barcode,
			special_payment_method,
			condition,
			currency,
			packing_quantity,
			quantity_available,
			bulk_cost,
			unit_price,
		}) => {
			try {
				if (!formik.isValid) return;

				const response = await api.post(
					"supplier/1/products",
					{
						name: name,
						category: category_id,
						sku_provider: sku,
						bar_code: barcode,
						method_of_payment: special_payment_method,
						condition: condition,
						currency: currency,
						cost_per_unit: unit_price,
						cost_per_package: bulk_cost,
						sugessted_price: 5000,
						provider_id: 1,
						commercialized: 1,
						approved: 1,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response.status === HttpStatusCode.Ok) {
					toast({
						title: `Se actualizo el producto correctamente`,
						status: "success",
					});

					formik.resetForm();
				}
			} catch (error) {
				console.error("error: ", error);
				const err = error as any;
				toast({
					title: `${err.message}`,
					status: "error",
				});
			}
		},
	});

	return (
		<>
			<Breadcrumb
				spacing='8px'
				separator={<ChevronRightIcon color='gray.500' />}
			>
				<BreadcrumbItem>
					<BreadcrumbLink href='/admin/products'>
						<Text fontSize='2xl'>Lista de Productos</Text>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbItem>
					<BreadcrumbLink>
						<Text fontSize='2xl'>Ver Producto</Text>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbItem>
					<BreadcrumbLink>
						<Text fontSize='2xl'># {id}</Text>
					</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
			<Box marginTop={4} marginBottom={10}>
				<form onSubmit={formik.handleSubmit}>
					<Box
						rounded={"lg"}
						bg={useColorModeValue("white", "gray.700")}
						boxShadow={"lg"}
						p={8}
					>
						<SimpleGrid columns={[2, null, 3]} spacing='40px'>
							<Box>
								<Image
									src='gibbresh.png'
									fallbackSrc='https://via.placeholder.com/250'
								/>
							</Box>

							<Box>
								<Text fontSize='3xl'>{product.name}</Text>
							</Box>
						</SimpleGrid>
						<SimpleGrid columns={[2, null, 3]} spacing='40px'>
							<FormControl
								id='name'
								isInvalid={
									formik.errors.name && formik.touched.name
										? true
										: false
								}
							>
								<FormLabel>Nombre</FormLabel>
								<Input
									type='text'
									value={formik.values.name}
									onChange={formik.handleChange}
								/>
								<FormErrorMessage>
									{formik.touched.name && formik.errors.name}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								id='category_id'
								isInvalid={
									formik.errors.category_id &&
									formik.touched.category_id
										? true
										: false
								}
							>
								<FormLabel>Categoría</FormLabel>

								<Select
									placeholder='Seleccione una categoría'
									value={formik.values.category_id}
									onChange={formik.handleChange}
								>
									{categories.map((category: IOptions) => (
										<option
											value={category.id}
											key={category.id}
										>
											{category.name}
										</option>
									))}
								</Select>
								<FormErrorMessage>
									{formik.touched.category_id &&
										formik.errors.category_id}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								id='sku'
								isInvalid={
									formik.errors.sku && formik.touched.sku
										? true
										: false
								}
							>
								<FormLabel>SKU</FormLabel>
								<Input
									type='text'
									value={formik.values.sku}
									onChange={formik.handleChange}
								/>
								<FormErrorMessage>
									{formik.touched.sku && formik.errors.sku}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								id='barcode'
								isInvalid={
									formik.errors.barcode &&
									formik.touched.barcode
										? true
										: false
								}
							>
								<FormLabel>Código de barra</FormLabel>
								<Input
									type='text'
									value={formik.values.barcode}
									onChange={formik.handleChange}
								/>
								<FormErrorMessage>
									{formik.touched.barcode &&
										formik.errors.barcode}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								id='special_payment_method'
								isInvalid={
									formik.errors.special_payment_method &&
									formik.touched.special_payment_method
										? true
										: false
								}
							>
								<FormLabel>Método de pago especial</FormLabel>
								<Select
									placeholder='Seleccione un método de pago'
									value={formik.values.special_payment_method}
									onChange={formik.handleChange}
								>
									{specialPaymentMethods.map(
										(paymentMethod: IOptions) => (
											<option
												value={paymentMethod.id}
												key={paymentMethod.id}
											>
												{paymentMethod.name}
											</option>
										)
									)}
								</Select>
								<FormErrorMessage>
									{formik.touched.special_payment_method &&
										formik.errors.special_payment_method}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								id='condition'
								isInvalid={
									formik.errors.condition &&
									formik.touched.condition
										? true
										: false
								}
							>
								<FormLabel>Condición</FormLabel>
								<Select
									placeholder='Seleccione una condición'
									value={formik.values.condition}
									onChange={formik.handleChange}
								>
									{conditions.map((condition: IOptions) => (
										<option
											value={condition.id}
											key={condition.id}
										>
											{condition.name}
										</option>
									))}
								</Select>
								<FormErrorMessage>
									{formik.touched.condition &&
										formik.errors.condition}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								id='currency'
								isInvalid={
									formik.errors.currency &&
									formik.touched.currency
										? true
										: false
								}
							>
								<FormLabel>Moneda</FormLabel>
								<Select
									placeholder='Seleccione una moneda'
									value={formik.values.category_id}
									onChange={formik.handleChange}
								>
									{currencies.map((currency: IOptions) => (
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
								id='packing_quantity'
								isInvalid={
									formik.errors.packing_quantity &&
									formik.touched.packing_quantity
										? true
										: false
								}
							>
								<FormLabel>Cantidad de empaque</FormLabel>
								<Input
									type='text'
									value={formik.values.packing_quantity}
									onChange={formik.handleChange}
								/>
								<FormErrorMessage>
									{formik.touched.packing_quantity &&
										formik.errors.packing_quantity}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								id='quantity_available'
								isInvalid={
									formik.errors.quantity_available &&
									formik.touched.quantity_available
										? true
										: false
								}
							>
								<FormLabel>Cantidad disponible</FormLabel>
								<Input
									type='text'
									value={formik.values.quantity_available}
									onChange={formik.handleChange}
								/>
								<FormErrorMessage>
									{formik.touched.quantity_available &&
										formik.errors.quantity_available}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								id='bulk_cost'
								isInvalid={
									formik.errors.bulk_cost &&
									formik.touched.bulk_cost
										? true
										: false
								}
							>
								<FormLabel>Costo bulto</FormLabel>
								<Input
									type='text'
									value={formik.values.bulk_cost}
									onChange={formik.handleChange}
								/>
								<FormErrorMessage>
									{formik.touched.bulk_cost &&
										formik.errors.bulk_cost}
								</FormErrorMessage>
							</FormControl>

							{/* <FormControl
							id='files'
							isInvalid={
								formik.errors.files &&
								formik.touched.files
									? true
									: false
							}
						>
							<FormLabel>Imagen</FormLabel>
							<Input
								type='file'
								value={formik.values.files}
								onChange={(event) => {
									const files : any = event.target.files;
									const myFiles = Array.from(files);
									formik.setFieldValue("files", myFiles);
								  }}
								accept="image/*"
							/>
							<FormErrorMessage>
								{formik.touched.files &&
									formik.errors.files}
							</FormErrorMessage>
						</FormControl> */}

							<FormControl
								id='unit_price'
								isInvalid={
									formik.errors.unit_price &&
									formik.touched.unit_price
										? true
										: false
								}
							>
								<FormLabel>Precio unitario</FormLabel>
								<Input
									type='text'
									value={formik.values.unit_price}
									onChange={formik.handleChange}
								/>
								<FormErrorMessage>
									{formik.touched.unit_price &&
										formik.errors.unit_price}
								</FormErrorMessage>
							</FormControl>

							<Box
								bgColor={"brand.400"}
								rounded='2xl'
								padding={"1rem"}
								marginTop={"-1rem"}
								marginRight={"-1rem"}
							>
								<FormControl
									id='unit_price'
									isInvalid={
										formik.errors.unit_price &&
										formik.touched.unit_price
											? true
											: false
									}
								>
									<FormLabel textColor={"white"}>
										Precio sugerido
									</FormLabel>
									<Input
										bgColor={"white"}
										type='text'
										value={formik.values.unit_price}
										onChange={formik.handleChange}
									/>
									<FormErrorMessage>
										{formik.touched.unit_price &&
											formik.errors.unit_price}
									</FormErrorMessage>
								</FormControl>
							</Box>
						</SimpleGrid>

						<Stack direction={"row"} spacing={4} marginTop={4}>
							<Link href={"/admin/products"}>
								<Button
									bg={"red.300"}
									color={"white"}
									_hover={{
										bg: "red.500",
									}}
									type='button'
								>
									Cancelar
								</Button>
							</Link>

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
					</Box>
				</form>
			</Box>
		</>
	);
};

export default edit;
