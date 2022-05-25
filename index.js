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
        const toolsCollection = client.db('tools_bd').collection('tools')
        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        })

        app.post('/tools', async (req, res) => {
            const query = req.body;
            const result = await toolsCollection.insertOne(query);
            res.send(result)
        })

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