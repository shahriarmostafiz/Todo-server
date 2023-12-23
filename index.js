const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const myDatabase = client.db("taskManager");
const taskCollection = myDatabase.collection("tasks");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // app.get("/")
    app.post("/addTodo", async (req, res) => {
      const todo = req.body;
      const result = await taskCollection.insertOne(todo);
      res.send(result);
    });
    app.get("/todo/:email", async (req, res) => {
      const email = req.params.email;
      // console.log("email:", email);
      const query = { user: email };

      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: data.status,
        },
      };
      console.log(updateDoc);
      console.log(id);
      // res.send({ info: "will be updated soon " });
      const result = await taskCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.put("/todo/edit/:id", async (req, res) => {});
    // Send a ping to confirm a successful connectio
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("hello task");
});
app.listen(port, () => {
  console.log("listening on port", port);
});
