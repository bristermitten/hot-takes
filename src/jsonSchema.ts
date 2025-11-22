import fs from "node:fs";
import { z } from "zod";
import { HotTakeDataSchema } from "./hotTakes";

function writeJsonSchema() {
	const schema = z.toJSONSchema(HotTakeDataSchema, {
        reused: "ref"
    });

    const cwd = process.cwd();
	fs.writeFileSync(
		 `${cwd}/hotTakeData.schema.json`,
		JSON.stringify(schema, null, 4),
	);
	console.log(`JSON Schema written to ${cwd}/hotTakeData.schema.json`);
}

writeJsonSchema();
