const express = require('express');
const connectedDB = require('./config/dbConnect');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { courseRoutes } = require('./routes/courseRoutes');
const { tocRoutes } = require('./routes/tableOfContentRoutes');
const { tocSectionRoutes } = require('./routes/tocSectionRoutes');
const { chapterRoutes } = require('./routes/chapterRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use('/api', courseRoutes);
app.use('/api', tocSectionRoutes);
app.use('/api', tocRoutes);
app.use('/api', chapterRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found - ' + req.originalUrl);
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || 'Internal Server Error',
    status: 'error',
  });
});

const startServer = async () => {
  await connectedDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
