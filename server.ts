import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();



app.get("/stations", async (req, res) => {
  try{
    const dbres = await client.query('select from_tiploc, to_tiploc, distance from tracks');
    res.json(dbres.rows);
  }
  catch (error){
    res.status(404)
    console.error(error)
  }

});

// Once you have the 
// app.get("/closest/:station1/:station2", async (req, res)=>{
//   try{
//     const station1 = req.params.station1;
//     const station2 = req.params.station2;
//     const dbres = await client.query(`select from_tiploc, to_tiploc, distance from tracks where from_tiploc = ${station1} or to_tiploc = ${station2} order by from_tiploc
//     '`);
//     res.json(dbres.rows);
//   }/pcs/click
//   catch (error){
//     res.status(404)
//     console.error(error)  
//   }
// });





//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
