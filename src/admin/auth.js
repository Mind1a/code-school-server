const Auth = require('../models/Auth');

const getLoginPage = (error = '') => `
<!DOCTYPE html>
<html>
<head>
  <title>Admin Login - CodeSchool</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #0f111a; /* ძალიან მუქი ლურჯი/შავი */
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #e0e0e0;
    }
    .login-container {
      background: #1a1d29; /* მუქი რუხი ბლოკი */
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      width: 100%;
      max-width: 400px;
      border: 1px solid #2d3245;
    }
    h1 {
      color: #ffffff;
      margin-bottom: 10px;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    p {
      color: #94a3b8;
      margin-bottom: 30px;
      font-size: 14px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      color: #cbd5e1;
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 14px;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      background: #0f111a;
      border: 1px solid #334155;
      border-radius: 8px;
      font-size: 16px;
      color: white;
      transition: all 0.3s ease;
    }
    input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
    button {
      width: 100%;
      padding: 13px;
      background: #ffffff;
      color: #000000;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 10px;
    }
    button:hover {
      background: #f1f1f1;
      transform: translateY(-1px);
    }
    button:active {
      transform: translateY(0);
    }
    .error {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid rgba(239, 68, 68, 0.2);
      font-size: 14px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <h1>CodeSchool Admin</h1>
    <p>ავტორიზაცია ადმინისტრატორისთვის</p>
    ${error ? `<div class="error">${error}</div>` : ''}
    <form method="POST" action="/admin/login">
      <div class="form-group">
        <label for="email">ელ-ფოსტა</label>
        <input type="email" id="email" name="email" required autofocus placeholder="admin@example.com">
      </div>
      <div class="form-group">
        <label for="password">პაროლი</label>
        <input type="password" id="password" name="password" required placeholder="••••••••">
      </div>
      <button type="submit">შესვლა</button>
    </form>
  </div>
</body>
</html>
`;

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log('🔑 Admin login attempt:', email);
  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return res.send(getLoginPage('Invalid email or password'));
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('❌ Wrong password');
      return res.send(getLoginPage('Invalid email or password'));
    }
    req.session.adminUser = {
      email: user.email,
      id: user._id.toString(),
      fullName: user.fullName,
    };
    console.log('✅ Login successful, redirecting to /admin');
    return res.redirect('/admin');
  } catch (error) {
    console.error('💥 Login error:', error);
    return res.send(getLoginPage('An error occurred. Please try again.'));
  }
};

const handleLogout = (req, res) => {
  req.session.destroy();
  console.log('🚪 Admin logged out');
  res.redirect('/admin/login');
};

const requireAdminAuth = (req, res, next) => {
  if (
    req.path === '/login' ||
    req.path === '/logout' ||
    req.path.startsWith('/frontend/assets') ||
    req.path.startsWith('/frontend')
  ) {
    return next();
  }
  if (req.session.adminUser) {
    return next();
  }
  return res.redirect('/admin/login');
};

module.exports = {
  getLoginPage,
  handleLogin,
  handleLogout,
  requireAdminAuth,
};
