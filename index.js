process['env']['NODE_ENV'] = process['env']['NODE_ENV'] || 'development';
require('dotenv').config({ path: `./.env.${process['env']['NODE_ENV']}` });

const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');


const db = require('./config/connection');
const port_no = process.env.PORT || 4000;

let app = express();
app.use(cors());
db.getConnection();
app.use(morgan('dev'));
app.use(compression());
app.use(express.static(__dirname + '/frontend/public'));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

require('./routes')(app);
app.get('*', (req, res) => res.sendFile(path.normalize(__dirname + '/public/index.html')));

let server = require('http').createServer(app);

server.listen(port_no, () => console.log(`NFT is serving on ${port_no} ${process['env']['NODE_ENV']}`));