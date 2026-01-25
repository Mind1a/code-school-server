const express = require('express');
const connectedDB = require('./config/dbConnect');
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const createAdminPanel = require('./admin/admin');
const { courseRoutes } = require('./routes/courseRoutes');
const { tocRoutes } = require('./routes/tableOfContentRoutes');
const { chapterRoutes } = require('./routes/chapterRoutes');
const { homeworkRoutes } = require('./routes/homeworkRoutes');
const { authRoutes } = require('./routes/authRoutes');
const {
  getLoginPage,
  handleLogin,
  handleLogout,
  requireAdminAuth,
} = require('./admin/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      process.env.SERVER_URL || 'http://localhost:3030',
    ],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.ADMIN_SESSION_SECRET || 'admin-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
    name: 'admin-session',
  })
);

const startServer = async () => {
  try {
    await connectedDB();

    const AdminJSExpress = await import('@adminjs/express');
    const admin = createAdminPanel();
    const adminRouter = AdminJSExpress.default.buildRouter(admin);

    app.get('/admin/login', (req, res) => {
      if (req.session.adminUser) {
        return res.redirect('/admin');
      }
      res.send(getLoginPage());
    });

    app.post('/admin/login', handleLogin);
    app.get('/admin/logout', handleLogout);

    app.use('/admin', requireAdminAuth, adminRouter);

    app.use('/api', courseRoutes);
    app.use('/api', tocRoutes);
    app.use('/api', chapterRoutes);
    app.use('/api', homeworkRoutes);
    app.use('/api', authRoutes);

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

    app.listen(PORT, () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Admin login at http://localhost:${PORT}/admin/login\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
