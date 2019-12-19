import express from 'express'
import config from 'config'
import bodyParser from 'body-parser'
//import dbConfig from './config/database.config';
import userRoute from './routes/users.route'
import mongoose from 'mongoose'


if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

// Connecting to the database
mongoose.connect(config.get("dbConfig"), {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// create express app
const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))



app.use('/api/user',userRoute)
console.log(userRoute);
console.log(app);

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// listen for requests
app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});