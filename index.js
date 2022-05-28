const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
        const profileCollection = client.db('tools_bd').collection('profile')
        const userCollection = client.db('tools_bd').collection('user')

        function verifyJWT(req, res, next) {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.stats(404).send({ message: 'UnAuthorized access' })
            }
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.ASSESS_TOKEN_SECRET, function (err, decoded) {
                if (err) {
                    return res.status(403).send({ message: 'Forbidden access' })
                }
                req.decoded = decoded;
                next();
            });

        }

        const verifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email;
            const requesterAccount = await userCollection.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                next();
            }
            else {
                res.status(403).send({ message: 'forbidden' });
            }
        }
        app.post('/tools', async (req, res) => {
            const tools = req.body;
            const result = await toolsCollection.insertOne(tools);
            res.send(result)
        })
        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        })

        app.get('/user', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });


        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ASSESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token });
        });

        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
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
        app.get('/profile/:email', async (req, res) => {
            const query = { email: req.params.email };
            const cursor = bookingCollection.find(query);

            const profile = await cursor.toArray();
            res.send(profile);
        })



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
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(filter);
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