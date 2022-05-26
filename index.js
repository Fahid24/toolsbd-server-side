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

        app.get('/booking/:email', async (req, res) => {
            const query = { email: req.params.email };
            const cursor = bookingCollection.find(query);
            const booking = await cursor.toArray();
            res.send(booking)
        })

        // app.get('/parts/:email', async (req, res) => {
        //     const result = await orderCollection.find({ email: req.params.email }).toArray();
        //     res.send(result)
        // })

        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = toolsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
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