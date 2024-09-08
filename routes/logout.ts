export default function () {
	return (request, response) => {
		request.session.destroy();
		response.redirect("/");
	};
}
