import type { Request, Response } from "express"
import type { Config } from "../api/types"

export default function (config: Config) {
	return (request: Request, response: Response) => {
		response.render("reference", {
			page: "reference",
			featureMap: config.featureMap,
		});
	};
}
