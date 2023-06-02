// Express app
const express = require('express');
const app = express();
const port = 80;

// Additional imports
const fs = require('fs');
const path = require('path');

// Static files and routes (the javascript routes are in ../public/routes/<route>.js, import all the ones that exist, make sure you go to the parent directory first and then import the /public/routes/<route>.js file). Avoid the require(...) is not a function error.
app.use(express.static(path.join(__dirname, '../public')));

// Get the path to the routes directory
const routesPath = path.join(path.resolve(__dirname, '..'), 'public', 'routes');

// Read the directory and get all the files
const routeFiles = fs.readdirSync(routesPath);

// Loop through the files and register them as routes
routeFiles.forEach((file) => {
  // Only import JS files
  if (path.extname(file) === '.js') {
    // Get the route object from the file
    const route = require(path.join(routesPath, file));

    // Check if the route object is defined and has a router property
    if (route && route.router) {
      // Register the route
      app.use(route.path, route.router);
    } else {
      console.error(`Route ${file} is not defined correctly`);
    }
  }
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// Listen on port
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Export app and server
module.exports = { app, server };