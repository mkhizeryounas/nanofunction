#!/usr/bin/env node
var path = require("path");
var fs = require("fs");
const program = require("commander");
const express = require("express");
const app = express();
const portfinder = require("portfinder");
var reload = require("require-reload")(require);

portfinder.basePort = process.env.PORT || 3000;

program.version("0.0.1", "-v, --version").action(async filePath => {
  if (typeof filePath === "object")
    throw new Error("Params missing, provide module path");
  if (filePath.includes(".js")) {
    filePath = `./${filePath}`;
  } else {
    throw new Error("Invalid params passed, provide a valid module path");
  }
  app.use(async (req, res) => {
    try {
      var lib = path.join(process.cwd(), filePath);
      await reload(lib)(req, res);
    } catch (err) {
      console.log("Err", err);
      res.status(500).json({
        status: false,
        error: "Internal server error",
        data: {}
      });
    }
  });
  let port = await portfinder.getPortPromise();
  app.listen(port, () => console.log(`Accepting connections on port ${port}!`));
});

program.parse(process.argv);

process.on("uncaughtException", function(err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});
