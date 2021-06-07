// Simple Express server setup to serve the build output
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');

const app = express();
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const DIST_DIR = './dist';



app.use(express.static(DIST_DIR));

const service = require('../src/server/service.js')(app);

app.get('/', (req, res) => {
    //res.setHeader("Content-Security-Policy","img-src * data: ;")
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);
