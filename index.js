#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const program = require("commander");
const express = require("express");
const app = express();
const router = express.Router();
const portfinder = require("portfinder");
const reload = require("require-reload")(require);
const chalk = require("chalk");
let __filePath = "";
portfinder.basePort = process.env.PORT || 3000;

program.version("1.1", "-v, --version").action(async filePath => {
  if (typeof filePath === "object")
    throw new Error("Params missing, provide module path");
  if (filePath.includes(".js")) {
    filePath = `./${filePath}`;
  } else {
    throw new Error("Invalid params passed, provide a valid module path");
  }
  __filePath = filePath;
  let port = await portfinder.getPortPromise();
  app.listen(port, () =>
    console.log(chalk.blue(`Accepting connections on port ${port}!`))
  );
});

router.use(async (req, res, next) => {
  try {
    var lib = path.join(process.cwd(), __filePath);
    await reload(lib)(req, res);
    console.log(chalk.green("Success - 200"));
  } catch (err) {
    console.log(chalk.red("Error 400 - "), err);
    res.status(400).json({
      status: false,
      error: "Bad Request",
      data: err.stack || {}
    });
  } finally {
    next();
  }
});
app.use("/", router);

process.on("uncaughtException", function(err) {
  console.error(chalk.red("Error 500 - "), err.stack);
  console.error(chalk.blue("Edit module to restart"));
});

program.parse(process.argv);
