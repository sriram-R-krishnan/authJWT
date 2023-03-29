const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


// signUp 

const signUp = async (req, res) => {

    try {
        const { userName, password } = await req.body;

        // input Validation
        if (!(userName && password)) {
            return res.status(400).send("All input is required");
        }

        // check if the user is already registered or not
        const existingUser = await db.collection("users").findOne({ userName: userName });
        if (existingUser) {
            return res.json({ log: "User Already Exists" });
        }

        // hashed password
        const hashPassword = await bcrypt.hash(password, 10);

        // if accepts all logic add to database
        const newUser = { userName: userName, password: hashPassword };
        const result = await db.collection("users").insertOne(newUser);

        // create token
        const token = jwt.sign(
            { id: result.insertedId, userName: newUser.userName },
            process.env.jwtSecurityKey,
            {
                expiresIn: process.env.expiry,
            }
        );

        // save token in the database
        await db.collection("users").updateOne(
            { _id: result.insertedId },
            { $set: { token: token } }
        );

        res.json({ status: "success", userName, hashPassword, token })
    } catch (error) {
        res.status(500).json({ log: "An error occurred" });
    }

}


// logIn

const logIn = async (req, res) => {

    try {
        const { userName, password } = req.body;
      
        if (!(userName && password)) {
          return res.status(400).send("All input is required");
        }
      
        const user = await db.collection("users").findOne({ userName: userName });
      
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { id: user._id, userName: user.userName },
            process.env.jwtSecurityKey,
            {
              expiresIn: process.env.expiry,
            }
          );
      
          // Update user with token
          const database = db.collection("users");
          database.updateOne(
            { _id: user._id },
            { $set: { token: token } }
          );
      
          // Send response with status
          res.json({ status: user });
        } else {
          throw new Error("Invalid username or password");
        }
      } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).send(error.message);
      }
      

    
}

module.exports = { signUp, logIn }