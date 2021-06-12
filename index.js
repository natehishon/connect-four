const express = require("express");
const app = express();
const cors = require('cors');
const path = require("path");

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV === "production") {
    //server static content
    //npm run build
    app.use(express.static(path.join(__dirname, "client/build")));
}

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/jwtAuth"))
app.use("/dashboard", require("./routes/dashboard"))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});


app.listen(PORT, () => {
    console.log('server running')
});