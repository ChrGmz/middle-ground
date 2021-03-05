const express = require('express');
const helmet = require('helmet');
const router = require('./routes');

const app = express();
process.env.PRODUCTION_MODE || app.use(require('cors')());
const PORT = process.env.SERVER_PORT || 3001;

app.use(helmet());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
