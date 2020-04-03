const path = require("path");
const fs = require("fs");

function cachebust() {
	const output = path.join(__dirname, "public", "resources-cachebust.json");
	if (fs.existsSync(output)) {
		fs.unlinkSync(output);
	}
	let data = `{\n\t"cacheTimestamp": "${Date.now()}"\n}\n`;
	fs.writeFile(output, data, (error) => {
		if (error) {
			console.log(error);
			process.exit(1);
		}
		process.exit(0);
	});
}
cachebust();
