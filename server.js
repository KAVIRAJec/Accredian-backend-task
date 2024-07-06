const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors()); 
app.use(express.json());
app.use(bodyParser.json());

//routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/refer', require('./routes/refer'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ message: `Internal Server Error:${err}` });
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});