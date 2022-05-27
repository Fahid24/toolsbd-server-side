const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3txxu4y.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect();
        const toolsCollection = client.db('tools_bd').collection('tools');
        const bookingCollection = client.db('tools_bd').collection('booking');
        const reviewCollection = client.db('tools_bd').collection('review');
        const prfileCollection = client.db('tools_bd').collection('profile');

        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        })

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result)
        })
        app.post('/profile', async (req, res) => {
            const profile = req.body;
            const result = await profileCollection.insertOne(profile);
            res.send(result)
        })

        app.get('/booking/:email', async (req, res) => {
            const query = { email: req.params.email };
            const cursor = bookingCollection.find(query);
            const booking = await cursor.toArray();
            res.send(booking)
        })
        app.get('/profile', async (req, res) => {
            const query = {};
            const cursor = profileCollection.find(query);
            const profile = await cursor.toArray();
            res.send(profile)
        })

        // app.delete('/booking/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const filter = { email: email };
        //     const result = await bookingCollection.deleteOne(filter);
        //     res.send(result);
        // })


        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = toolsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })


        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(filter);
            res.send(result);
        })

    }
    finally {

    }

}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('ToolsBd World!')
})

app.listen(port, () => {
    console.log(`tools app listening on port ${port}`)
})