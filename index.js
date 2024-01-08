const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PermissionModel = require('./models/Permission')
const FaultModel = require('./models/Fault')
const UserModel = require('./models/User')
const RequestModel = require('./models/Requests')
const cookieParser = require('cookie-parser');
const authRoutes = require("./Routes/AuthRoutes");
const FaultingModel = require("./models/Faulting")
const ArchiveModel = require('./models/Archive')
const multer = require('multer');
const xlsx = require('xlsx');
require('dotenv').config();

const StudentModel = require('./models/Student');

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(cookieParser())
app.use(authRoutes);

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
  
      const studentsData = jsonData.map((row) => ({
        name: `${row[1]} ${row[2]}`,
        gender: row[3],
        stream: row[4],    
      }));
  
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
  app.post('/addstudent', (req, res) => {
    StudentModel.create(req.body)
    .then(student => res.json(student))
    .catch(err => {
     console.error('Error saving student:', err);
      res.status(500).json("Server error");
})
})
app.post('/students', async (req, res) => {
  try {
    const streamPattern = new RegExp(req.body.stream, 'i');
    const students = await StudentModel.find({ stream: streamPattern });

    res.json(students);
    console.log(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json("Server error");
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
app.post('/permsfilter', async (req, res) => {
  try {
    const { name, stream, year } = req.body;
    const query = {}
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (stream) {
      query.stream = { $regex: stream, $options: "i" };
    }
    const perms = await PermissionModel.find(query);

    console.log("Name:", name, "Stream:", stream, "Year:", year);
    
    if (perms.length > 0) {
      res.json(perms);
    } else {
      res.json({ message: "No faults found with the given criteria." });
    }
    
  } catch (error) {
    console.log(error); 
    res.status(500).json({ error: "An error occurred while fetching data from MongoDB." });
  }
})

app.post('/archive', (req, res) => {
ArchiveModel.create(req.body)
.then(archive => {res.json(archive)
console.log("Successfully Saved")})
.catch(err => {
  console.error('Error Saving archive:', err);
  res.status(500).json("Server error");
})
})
app.delete('/archive/:id', (req, res) => {
  const studentId = req.params.id;

  StudentModel.findByIdAndDelete(studentId)
    .then(student => {
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json({ message: 'Student deleted successfully', deletedStudent: student });
      console.log('Successfully deleted');
    })
    .catch(err => {
      console.error('Error deleting student', err);
      res.status(500).json({ error: 'Server error' });
    });
});


app.get('/fault', (req, res) => {
  FaultModel.find({})
  .then(faults => res.json(faults))
  .catch(err => {
    console.error('Error fetching faults:', err);
    res.status(500).json("Server error");
  });
})
app.post('/faulting', (req, res) => {
FaultingModel.create(req.body)
.then(faulting => {res.json(faulting)
  console.log(faulting)})
  .catch(err => {
    console.error('Error saving Faulting:', err);
    res.status(500).json("Server error");
  });
})
app.get('/faulting', (req, res) => {
  FaultingModel.find({})
  .then(faulting => res.json(faulting))
  .catch(err => {
    console.error('Error fetching Faultings:', err);
    res.status(500).json("Server error");
  });
})
app.put('/faulting', async (req, res) => {
  try {
    const updatedValues = { $set: req.body }; 

    const result = await FaultingModel.updateOne({}, updatedValues);

    if (result.nModified > 0) {
      res.status(200).json({ message: 'Fault updated successfully' });
    } else {
      res.status(404).json({ message: 'Fault not found or no modifications' });
    }
  } catch (error) {
    console.error('Error updating fault:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/faulting', (req, res) => {
  FaultingModel.findOneAndDelete(req.body)
  .then(faulting => {res.json(faulting)
    console.log("Successfully deleted")})
  .catch(err => {
    console.error('Error fetching Faultings:', err);
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
