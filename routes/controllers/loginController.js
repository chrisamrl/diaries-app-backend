const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  const isPasswordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && isPasswordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const payload = {
    name: user.name,
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(
    payload,
    process.env.SECRET,
    { expiresIn: 7 * 24 * 60 * 60 },
  );

  return res
    .status(200)
    .json({ token, username: user.username, name: user.name });
};

module.exports = handleLogin;
