const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user'); 

const register = async (req, res) => {
  const { username, password, isAdmin } = req.body;

  // Ensure all necessary fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      username,
      password: hashedPassword,
      isAdmin, // Optional, default can be set in the model if needed
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with user data (ID and isAdmin flag)
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with the token
    res.json({ token });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
};

module.exports = { register, login };
