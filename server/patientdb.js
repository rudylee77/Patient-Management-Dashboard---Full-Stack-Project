const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('patientdb.json');
const middlewares = jsonServer.defaults();

const PORT = 4000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST') {
    // Extract the new field data from the request body
    const newFields = req.body.additionalFields;

    // Loop through all patients and update their additionalFields with the new fields
    const patients = router.db.get('patients').value();
    patients.forEach((patient) => {
      if (!patient.additionalFields) {
        patient.additionalFields = [];
      }

      // Loop through each new field and add it to the patient's additionalFields
      newFields.forEach((field) => {
        patient.additionalFields.push({ label: field.label, value: '' });
      });
    });

    // Continue to JSON Server router
    next();
  } else {
    next();
  }
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
