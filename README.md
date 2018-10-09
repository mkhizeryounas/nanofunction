# NanoFunction

## Introduction

> Asynchronous HTTP microservices using function based architecture.

## Code Samples

Create an index.js file and export a function that accepts the standard http.IncomingMessage and http.ServerResponse objects:

```
module.exports = (req, res) => {
  res.json({
    data: {
      handle: "@mkhizeryounas"
    }
  });
};
```

## Installation

```
npm install nanofunction --save
```

Next, ensure that the main property inside package.json points to your microservice (which is inside index.js in this example case) and add a start script:

```
{
  "main": "index.js",
  "scripts": {
    "start": "nanofunction index.js"
  }
}
```
