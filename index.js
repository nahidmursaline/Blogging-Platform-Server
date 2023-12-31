const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5biojd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const blogCollection = client.db('blogDB').collection('blog')

    app.post('/blog', async(req, res) => {
      const newBlog = req.body;
      console.log(newBlog)
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    })


    app.get('/blog', async(req, res) => {
      console.log(req.query)
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await blogCollection.find(query).toArray();
      res.send(result);
    })
    
    app.get('/blog', async(req, res) => {
      const cursor = blogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/blog/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await blogCollection.findOne(query)
      res.send(result);
    })

    app.put('/blog/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedBlog = req.body;
      const blog = {
        $set: {
          title: updatedBlog.title,
           theme: updatedBlog.theme,
            author: updatedBlog.author,
             ratings: updatedBlog.ratings,
              post: updatedBlog.post,
               date: updatedBlog.date,
                photo: updatedBlog.photo,
        }
      }
      const result = await blogCollection.updateOne(filter, blog, options)
      res.send(result);
    })

    app.delete('/blog/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await blogCollection.deleteOne(query)
      res.send(result);
    })

    



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=> {
    res.send('Blogging Site is running');
})

app.listen(port, ()=> {
    console.log(`Blogging Site is running on port: ${port}`)
})