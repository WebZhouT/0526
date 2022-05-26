// api/server.js

const express = require("express")
const app = express()
app.use(express.json());

app.get("/", function(req, res) {
  res.json({"name": "pokecode"})
})

app.listen(3000, () => {
  console.log("app listening on port 3000")
})
