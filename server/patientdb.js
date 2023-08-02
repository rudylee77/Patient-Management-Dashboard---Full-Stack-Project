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
    const newFields = req.body.additionalFields;
    console.log(newFields)

    const patients = router.db.get('patients').value();
    patients.forEach((patient) => {
      if (!patient.additionalFields) {
        patient.additionalFields = [];
      }

      newFields.forEach((field) => {
        if (!patient.additionalFields.find((f) => f.label === field.label)) {
          patient.additionalFields.push({ label: field.label, value: '' });
        }
      });
    });

    next();
  } else if (req.method === 'PUT') {
    const updatedFields = req.body.additionalFields;

    const patients = router.db.get('patients').value();
    patients.forEach((patient) => {
      if (!patient.additionalFields) { 
        patient.additionalFields = [];
      }
      updatedFields.forEach((field) => {
        if (!patient.additionalFields.find((f) => f.label === field.label)) {
          patient.additionalFields.push({ label: field.label, value: '' });
        }
      });
    });

    next();
  } else {
    next();
  }
});

server.patch('/removeAdditionalField/:additionalFieldLabel', async (req, res) => {
  const { additionalFieldLabel } = req.params;

  try {
    const patients = await router.db.get('patients').value();

    // Loop through all patients and remove the specified additionalFieldLabel from their additionalFields
    patients.forEach((patient) => {
      if (patient.additionalFields) {
        patient.additionalFields = patient.additionalFields.filter((field) => field.label !== additionalFieldLabel);
      }
    });
    await router.db.set('patients', patients).write();

    res.json(patients);
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.patch('/removePatient/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const patients = await router.db.get('patients').value();
    
    // Find the index of the patient with the matching ID
    const indexToRemove = patients.findIndex(patient => patient.id === id);
    
    patients.splice(indexToRemove, 1);
    await router.db.set('patients', patients).write();
    res.json({ message: 'Patient removed successfully' });
    
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});