const jwt = require('jsonwebtoken');

const identifier = (req, res, next) => {
	let token;
	if (req.headers.client === 'not-browser') {
		token = req.headers.authorization;
	} else {
		token = req.cookies['Authorization'];
	}

	if (!token) {
		return res.status(403).json({ success: false, message: 'Unauthorized' });
	}

	try {
		const userToken = token.split(' ')[1];
		const jwtVerified = jwt.verify(userToken, "elfeel");
		if (jwtVerified) {
			req.user = jwtVerified;
			next();
		} else {
			throw new Error('error in the token');
		}
	} catch (error) {
		console.log(error);
	}
};
const  verifyToken = (req, res, next)=> {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];
	// Check if bearer is undefined
	if(typeof bearerHeader !== 'undefined') {
	  // Split at the space
	  const bearer = bearerHeader.split(' ');
	  // Get token from array
	  const bearerToken = bearer[1];
	  // Set the token
	  req.token = bearerToken;
	  // Next middleware
	  next();
	} else {
	  // Forbidden
	  res.sendStatus(403);
	}
  
  }
const authenticateToken=(req, res, next)=> {
	//const authHeader = req.headers['authorization']
	const authHeader = req.cookies.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
	console.log("Authorization Header:", authHeader); // Debugging

    const token = authHeader.split(" ")[1]; // ✅ Extract only the token part
	
    console.log("All Cookies:", req.cookies); // ✅ Debugging

	//token = req.cookies.jwt; // ✅ Extract token from cookies

	console.log(token)
	if (token == null) return res.sendStatus(401)
  
	jwt.verify(token, "elfeel", (err, user) => {
	  console.log(err)
	  if (err) return res.sendStatus(403)
	  req.user = user
	  next()
	})
  }

module.exports = {identifier,verifyToken,authenticateToken}