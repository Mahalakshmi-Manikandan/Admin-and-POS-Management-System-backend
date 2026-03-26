import jwt from "jsonwebtoken";

/* ================= ACCESS TOKEN ================= */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );
};

/* ================= REFRESH TOKEN ================= */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
};

/* ================= AUTH MIDDLEWARE ================= */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

/* ================= ROLE MIDDLEWARE ================= */
export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

  export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];

    // Verify access token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};



export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};


