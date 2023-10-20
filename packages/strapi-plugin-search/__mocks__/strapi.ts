import fs from "fs";
import path from "path";
import strapi from "@strapi/strapi";

let instance;
const APP_PATH = path.resolve(path.join(__dirname, "..", "..", "..", "playground"));

/**
 * @returns {strapi} Strapi instance
 */
export async function createMockStrapi() {
	if (!instance) {
		const baseDir = path.resolve(APP_PATH);

		const options = {
			appDir: baseDir,
			distDir: baseDir,
		};
		instance = strapi(options);

		await instance.load();

		instance.log.level = 1;

		await instance.server.mount();

		instance.http = instance.server.httpServer;
	}
	return instance;
}

/**
 * Deletes the test sqlite database.
 */
export async function removeTestDatabase() {
	const dbSettings = instance.config.get("database.connection");

	//close server to release the db-file
	await instance.server.httpServer.close();

	// close the connection to the database before deletion
	await instance.db.connection.destroy();

	//delete test database after all tests have completed
	if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
		const tmpDbFile = dbSettings.connection.filename;
		if (fs.existsSync(tmpDbFile)) {
			fs.unlinkSync(tmpDbFile);
		}
	}
}
