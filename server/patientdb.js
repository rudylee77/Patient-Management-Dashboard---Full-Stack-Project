const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('patientdb.json');
const middlewares = jsonServer.defaults();

const PORT = 4000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.id = Date.now();
  }
  // Continue to JSON Server router
  next();
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
