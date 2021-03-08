const express = require('express');
const helmet = require('helmet');
const router = require('./routes');

const app = express();
if (process.env.NODE_ENV !== 'production') app.use(require('cors')({
  origin: `http://localhost:${process.env.CLIENT_PORT}`
}));

const PORT = process.env.SERVER_PORT || 3001;

app.use(helmet());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
