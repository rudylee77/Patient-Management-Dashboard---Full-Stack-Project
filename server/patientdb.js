const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('patientdb.json');
const middlewares = jsonServer.defaults();

const PORT = 4000;

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST') {
    // Extract the new field data from the request body
    const newFields = req.body.additionalFields;
    console.log(newFields)
    // Loop through all patients and update their additionalFields with the new fields
    const patients = router.db.get('patients').value();
    patients.forEach((patient) => {
      if (!patient.additionalFields) {
        patient.additionalFields = [];
      }

      // Loop through each new field and add it to the patient's additionalFields
      newFields.forEach((field) => {
        if (!patient.additionalFields.find((f) => f.label === field.label)) {
          // If the field doesn't already exist in the patient's additionalFields, add it
          patient.additionalFields.push({ label: field.label, value: '' });
        }
      });
    });

    // Continue to JSON Server router
    next();
  } else if (req.method === 'PUT') {
    // Extract the updated field data from the request body
    const updatedFields = req.body.additionalFields;

    // Loop through all patients and update their additionalFields with the updated fields
    const patients = router.db.get('patients').value();
    patients.forEach((patient) => {
      if (!patient.additionalFields) { 
        patient.additionalFields = [];
      }

      // Loop through each updated field and add it to the patient's additionalFields
      updatedFields.forEach((field) => {
        if (!patient.additionalFields.find((f) => f.label === field.label)) {
          // If the field doesn't already exist in the patient's additionalFields, add it
          patient.additionalFields.push({ label: field.label, value: '' });
        }
      });
    });

    // Continue to JSON Server router
    next();
  } else {
    next();
  }
});

server.patch('/removeAdditionalField/:additionalFieldLabel', async (req, res) => {
  const { additionalFieldLabel } = req.params;

  try {
    // Get the patients data asynchronously using the promise-based API
    const patients = await router.db.get('patients').value();

    // Loop through all patients and remove the specified additionalFieldLabel from their additionalFields
    patients.forEach((patient) => {
      if (patient.additionalFields) {
        patient.additionalFields = patient.additionalFields.filter((field) => field.label !== additionalFieldLabel);
      }
    });

    // Save the updated patients to the database (patientdb.json in this case)
    await router.db.set('patients', patients).write();

    res.json(patients);
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});