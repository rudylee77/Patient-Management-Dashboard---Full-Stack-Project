const users = [
  {
    id: 1,
    username: "rudy",
    password: "password",
  },
];

exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ user });
};

exports.registerUser = (req, res) => {
  const { username, password } = req.body;
  const newUser = {
    id: users.length + 1,
    username,
    password,
  };

  users.push(newUser);

  res.json({ user: newUser });
};

exports.checkUsername = (req, res) => {
  const { username } = req.body;
  const usernameExists = users.some((user) => user.username === username);

  res.json({ usernameExists });
};
