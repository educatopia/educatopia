import type { RouteRequest, RouteResponse } from "../api/types"

export default function () {
	return (request: RouteRequest, response: RouteResponse) => {
		;(request as RouteRequest & { session: { destroy: () => void } }).session.destroy();
		response.redirect("/");
	};
}
