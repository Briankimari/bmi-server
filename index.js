// Import necessary packages and modules
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Create an Express application
const app = express();

// Load environment variables from a .env file
dotenv.config();

// Configure middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// Define a MongoDB schema for BMI data
const bmiSchema = new mongoose.Schema({
  fullName: String,
  age: Number,
  weight: Number,
  height: Number,
  bmi: Number,
  colorie: Number,
});

// Create a MongoDB model for BMI data
const BMI = mongoose.model('BMI', bmiSchema);

// Define a MongoDB schema for calorie data
const clSchema = new mongoose.Schema({
  heightC: Number,
  weightC: Number,
});

// Create a MongoDB model for calorie data
const cls = mongoose.model('colorie', clSchema);

// Establish a connection to the MongoDB database
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT || 5000, () => console.log(`Server is running on port: ${process.env.PORT || 5000}`)))
  .catch((error) => console.error(error.message));

// Define a route to save BMI data
app.post('/api/save-bmi', async (req, res) => {
  try {
    const { fullName, age, weight, height, bmi, colorie } = req.body;

    const newBMI = new BMI({
      fullName,
      age,
      weight,
      height,
      bmi,
      colorie,
    });

    await newBMI.save();
    res.status(200).json({ message: 'BMI data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define a route to save calorie data
app.post('/api/save-colorie', async (req, res) => {
  try {
    const { weightC, heightC } = req.body;

    const newColorie = new cls({
      weightC,
      heightC,
    });

    await newColorie.save();
    res.status(200).json({ message: 'Calorie data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to get all saved BMI records
app.get('/api/get-bmi', async (req, res) => {
  try {
    // Use Mongoose to fetch all BMI records from the database
    const bmiRecords = await BMI.find();
    res.status(200).json(bmiRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a BMI record by ID
app.delete('/api/delete-bmi/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Use Mongoose to find and delete the BMI record by ID
    const deletedBMI = await BMI.findByIdAndDelete(id);

    if (!deletedBMI) {
      return res.status(404).json({ message: 'BMI record not found' });
    }

    res.status(200).json({ message: 'BMI record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
