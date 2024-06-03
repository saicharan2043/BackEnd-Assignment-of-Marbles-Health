const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { open } = require("sqlite");
const databasePath = path.join(__dirname, "users.db");
const app = express();

app.use(express.json());
app.use(cors());

dotenv.config({
  path: "./data/config.env",
});

let db;

const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(process.env.PORT, () =>
      console.log(`server is running on port ${process.env.PORT}`)
    );
  } catch (error) {
    console.log(`Database connect error ${error}`);
  }
};

initializeDatabaseAndServer();

app.get("/", (req, resp) => {
  resp.send("hello word");
});

app.get("/users", async (req, resp) => {
  const { search = "", page = 1 } = req.query;
  const limit = 3;
  const skip = (page - 1) * limit;
  try {
    const query = `select * from users where name LIKE '%${search}%' limit ${limit} offset ${skip}`;
    const response = await db.all(query);
    resp.status(200);
    resp.send(response);
  } catch (e) {
    resp.send({ msg: "something want wrong" });
    resp.status(400);
  }
});

app.post("/adduser", async (req, resp) => {
  const { id, name, dob, number, email, description } = req.body;
  try {
    const query = `insert into users(id , name , dob , number , email , description) values('${id}' , '${name}' , '${dob}' , '${number}' , '${email}' , '${description}')`;
    await db.run(query);
    resp.status(200);
    resp.send("user created successfuly..");
  } catch (e) {
    resp.send({ msg: "something want wrong" });
    resp.status(400);
  }
});

app.put("/updateuser", async (req, resp) => {
  const { id, name, dob, number, email, description } = req.body;
  try {
    const query = `update users set id='${id}' , name = '${name}' , dob='${dob}', number='${number}' , email='${email}', description='${description}' where id = '${id}'`;
    await db.run(query);
    resp.status(200);
    resp.send("user details updated successfuly..");
  } catch (e) {
    resp.status(400);
    resp.send({ msg: "something want wrong" });
  }
});

app.delete("/removeuser", async (req, resp) => {
  const { id } = req.body;
  try {
    const query = `delete from users where id = '${id}'`;
    await db.run(query);
    resp.status(200);
    resp.send("user deleted successfuly..");
  } catch (e) {
    resp.status(400);
    resp.send({ msg: "something want wrong" });
  }
});
