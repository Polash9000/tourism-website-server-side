const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bkd8n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourism');
        const placeCollection = database.collection('places');

        // Get Places API
        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });

        // Get Single Places
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific place', id);
            const query = { _id: ObjectId(id) };
            const place = await placeCollection.findOne(query);
            res.json(place);
        });

        // POST API
        app.post('/places', async (req, res) => {
            const place = req.body;
            console.log('hit the api', place);
            const result = await placeCollection.insertOne(place);
            console.log(result);
            res.json(result);
        });

        // DELETE API
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await placeCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourism server is running');
});

app.listen(port, () => {
    console.log(('server running at port'))
})

// https://git.heroku.com/lit-ridge-73515.git