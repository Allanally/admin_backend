const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PermissionModel = require('./models/Permission')
const FaultModel = require('./models/Fault')
const UserModel = require('./models/User')
const RequestModel = require('./models/Requests')
const multer = require('multer');
const xlsx = require('xlsx'); // Add this line
require('dotenv').config();

const StudentModel = require('./models/Student');

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true,
}));

const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully.');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
      // Assuming each row in data is an array of values [name, secondName, gender, ...]
      const studentsData = jsonData.map((row) => ({
        firstName: row[0],     // Assuming the first column is firstName
        secondName: row[1],    // Assuming the second column is secondName
        gender: row[2],        // Assuming the third column is gender
        // Add more properties based on your data structure
      }));
  
      // Save each student to the MongoDB model
      const savedData = await StudentModel.insertMany(studentsData);
  
      console.log('Data saved and inserted successfully:', savedData);
  
      res.status(200).json({
        message: 'Data saved and inserted successfully',
        savedData,
      });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.post('/fault', (req, res) => {
  FaultModel.create(req.body)
    .then(fault => res.json(fault))
    .catch(err => {
      console.error('Error creating fault:', err);
      res.status(500).json("Server error");
    });
});
app.post("/", (req,res) => {
  
})

app.get('/fault', (req, res) => {
  FaultModel.find({})
  .then(faults => res.json(faults))
  .catch(err => {
    console.error('Error fetching faults:', err);
    res.status(500).json("Server error");
  });
})
app.get('/user', (req, res) => {
  UserModel.find({})
  .then(users => res.json(users))
  .catch(err => {
    console.error('Error fetching Users:', err);
    res.status(500).json("Server error");
  });
})
app.get('/request', (req, res) => {
  RequestModel.find({})
  .then(request => res.json(request))
  .catch(err => {
    console.error('Error fetching Requests:', err);
    res.status(500).json("Server error");
  });
})
app.delete('/request', (req, res) => {
  RequestModel.findOneAndDelete(req.body)
  .then(request => res.json(request))
  .catch(err => {
    console.error('Error deleting user:', err);
    res.status(500).json("Server error");
  });
})
app.get('/permissions', (req, res) => {
  PermissionModel.find({})
    .then(permissions => res.json(permissions))
    .catch(err => {
      console.error('Error fetching permissions:', err);
      res.status(500).json("Server error");
    });
});

app.post('/permission', (req, res) => {
  PermissionModel.create(req.body)
    .then(permission => {res.json(permission)
    console.log(permission)})
    .catch(err => {
      console.error('Error saving permission:', err);
      res.status(500).json("Server error");
    });
});

app.post('/pendings', (req, res) => {
PendingModel.create(req.body)
.then(pending => res.json(pending))
.catch(err => {
  console.error('Error saving permission:', err);
      res.status(500).json("Server error");
})
})

app.get('/pendings', (req,res) => {
  PermissionModel.find({})
  .then(pending => {res.json(pending)
  console.log(pending)})
      .catch(err => {
        console.error('Error fetching permissions:', err);
        res.status(500).json("Server error");
      });
})

app.delete('/pendings', (req, res) => {
  PendingModel.findOneAndDelete(req.body)
  .then(pending => res.json(pending))
  .catch(err => {
    console.error('Error deleting permissions:', err);
    res.status(500).json("Server error");
  });
})


app.listen(1337, () => {
  console.log("Server is running");
});
