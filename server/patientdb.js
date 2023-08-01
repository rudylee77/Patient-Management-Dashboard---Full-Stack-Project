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

    // If there are no new fields to add, proceed to JSON Server router
    if (!newFields || newFields.length === 0) {
      next();
      return;
    }

    try {
      // Get the patients data asynchronously using the promise-based API
      const patients = router.db.get('patients').value();

      // Loop through all patients and update their additionalFields with the new fields
      patients.forEach((patient) => {
        if (!patient.additionalFields) {
          patient.additionalFields = [];
        }

        // Check if the patient is the one being submitted (based on ID)
        const isSubmittedPatient = patient.id === req.body.id;

        // Loop through each new field and add it to the patient's additionalFields
        newFields.forEach((field) => {
          const existingFieldIndex = patient.additionalFields.findIndex((f) => f.label === field.label);
          if (existingFieldIndex !== -1) {
            // If the field already exists, update its value for the submitted patient
            if (isSubmittedPatient) {
              patient.additionalFields[existingFieldIndex].value = field.value;
            }
          } else {
            // If the field doesn't exist, add it to the patient's additionalFields
            patient.additionalFields.push({
              label: field.label,
              value: isSubmittedPatient ? field.value : '', // If it's the submitted patient, use the submitted value
            });
          }
        });
      });

      // Save the updated patients to the database (patientdb.json in this case)
      router.db.set('patients', patients).write();

      // Continue to JSON Server router
      next();
    } catch (err) {
      console.error('Error processing the request:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
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

server.post('/addAdditionalField', async (req, res) => {
  const { label, value } = req.body;

  try {
    // Get the patients data asynchronously using the promise-based API
    const patients = await router.db.get('patients').value();

    // Loop through all patients and add the new additional field
    patients.forEach((patient) => {
      if (!patient.additionalFields) {
        patient.additionalFields = [];
      }

      patient.additionalFields.push({ label, value });
    });

    // Save the updated patients to the database (patientdb.json in this case)
    router.db.set('patients', patients).write();

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