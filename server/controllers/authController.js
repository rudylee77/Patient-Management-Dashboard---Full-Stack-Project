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
  
    // For this example, we're just sending back the user details, but in a real application,
    // you would generate a token (JWT) here and include it in the response.
    res.json({ user });
  };