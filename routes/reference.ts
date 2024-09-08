export default function (config) {
	return (request, response) => {
		response.render("reference", {
			page: "reference",
			featureMap: config.featureMap,
		});
	};
}
