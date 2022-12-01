const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

// user : node_mongo_crud
// pass : aXbaQDtelz0bgVgZ

const uri =
  "mongodb+srv://node_mongo_crud:aXbaQDtelz0bgVgZ@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("food_express");
    const userCollection = database.collection("users");

    // add a new user
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // get all the user
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // deleted an user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // get a specifie user info and update data info
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deletedResult = await userCollection.findOne(query);
      res.send(deletedResult);
    });

    // UPDATE USER
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set : {
          name : updatedUser.name ,
          email : updatedUser.email,
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc, options);
      res.send(result)

    });

    app.get("/", (req,res) => {
      res.send("Allah Is Almighty")
    })
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my node crud server");
});

app.listen(port, () => {
  console.log(`Hello server side is running ${port}`);
});
