const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow all origins
// OR limit like this:
// app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json()); // This line is important for JSON body parsing!

app.post('/webhook/:id', (req, res) => {
    console.log('Received payload:', req.body);
    res.json({ status: 'received' });
});

app.listen(5678, () => console.log('Server running on http://localhost:5678'));
