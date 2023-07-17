const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "invoice.db");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let db;

//function for establishing connection between db and server
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(5000, () => {
      console.log("server is running");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

initializeDbAndServer();

//getting 10 invoices from database

app.get("/invoices/", cors(), async (req, res) => {
  try {
    const sqlQuery = `select * from invoices limit 10  `;

    const resObj = await db.all(sqlQuery);
    res.send(resObj);
  } catch (error) {
    console.log(error.message);
  }
});

//postMethod

app.post("/post/", async (req, res) => {
  try {
    const { name, num, amount, date } = req.body;

    const sqlQuery = `insert into invoices(name,invoice_date,invoice_num,invoice_amount)
    values('${name}',${date},${num},${amount})`;
    await db.run(sqlQuery);
    resObjForSend = { data: "add successfully" };
    res.send(resObjForSend);
  } catch (error) {
    console.log(error.message);
  }
});

//for updating

app.put("/put/", async (req, res) => {
  try {
    const { id, name, num, amount, date } = req.body;

    const sqlQuery = `update invoices set name = "${name}",invoice_date = ${date},invoice_num = ${num},invoice_amount = ${amount} where id=${id}`;

    await db.run(sqlQuery);
    resObjForSend = { data: "data updated successfully" };
    res.send(resObjForSend);
  } catch (error) {
    console.log(error.message);
  }
});

//getting based on id

app.get("/invoice/:id/", async (req, res) => {
  const { id } = req.params;
  const sqlQ = `select * from invoices where id=${id}`;
  const resForId = await db.get(sqlQ);
  res.send(resForId);
});

//deleting

app.delete("/delete/:id/", async (req, res) => {
  const { id } = req.params;
  const del = `delete from invoices where id=${id};`;
  await db.run(del);
  res.send({ data: "deleted successfully" });
});
