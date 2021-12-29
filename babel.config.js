module.exports = {
    presets: [
        "@babel/preset-react", [
            "@babel/preset-env",
            {
                useBuiltIns: "entry",
                corejs: 3.18,
                targets: ["defaults", ">0.001%", "ie 11", "chrome >= 15"]
            }
        ]
    ],
    comments: false,
    sourceMaps: false,
    highlightCode: true,
    exclude: [/node_modules/]
};