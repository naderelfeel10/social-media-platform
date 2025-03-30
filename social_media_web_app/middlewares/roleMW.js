const checkRole = (roles) => {
    return (req, res, next) => {
      console.log("Middleware: Checking Role");
      console.log("User Info in Request:", req.user); // ✅ Debugging
      console.log("Required Roles:", roles);
      console.log("User Role:", req.user?.role); // ✅ Correct placement
      if (!roles.includes(req.user.role)) {
        console.log("not found u 3m")
        return res.status(403).json({ message: "Access Denied: Insufficient permissions" });
      }
      next();
    };
  };
module.exports = checkRole;