#!/usr/bin/env node
var path = require("path");
var fs = require("fs");
const program = require("commander");
const express = require("express");
const app = express();
const portfinder = require("portfinder");
var reload = require("require-reload")(require);
const chalk = require("chalk");

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
      console.log("200 - Success");
    } catch (err) {
      console.log("Error 400 - ", chalk.red(err));
      res.status(400).json({
        status: false,
        error: "Bad Request",
        data: {}
      });
    }
  });
  let port = await portfinder.getPortPromise();
  app.listen(port, () => console.log(`Accepting connections on port ${port}!`));
});

program.parse(process.argv);

process.on("uncaughtException", function(err) {
  console.error(chalk.red("ERROR 500 - ", err.stack));
  console.error(chalk.blue("Edit module to restart"));
});
