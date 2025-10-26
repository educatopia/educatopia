import type { RouteRequest, RouteResponse } from "../api/types"

export default function () {
	return (request: RouteRequest, response: RouteResponse) => {
		(request as RouteRequest & { session: { destroy: (callback: (err?: Error) => void) => void } }).session.destroy((err) => {
			if (err) {
				console.error("Error destroying session:", err);
			}
			response.redirect("/");
		});
	};
}
