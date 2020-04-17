const path = require("path");

module.exports = {
	entry: {
		"dice-roller": path.join(__dirname, "dice-roller", "index.tsx"),
		"initiation-order": path.join(__dirname, "initiation-order", "index.tsx"),
		"battle-map": path.join(__dirname, "battle-map", "index.tsx"),
	},
	mode: process.env.NODE_ENV === "production" ? "production" : "development",
	module: {
		rules: [
			{
				test: /\.tsx?|\.(js|jsx)$$/,
				exclude: /(node_modules|bower_components)/,
				loader: "ts-loader",
				options: {
					configFile: path.join(__dirname, "tsconfig-preact.json"),
				},
			},
			{
				test: /\.s[ac]ss$/i,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	resolve: { extensions: ["*", ".js", ".jsx", ".ts", ".tsx"] },
	output: {
		filename: "[name].js",
		path: path.join(process.cwd(), "public", "preact"),
	},
};
