const express = require('express');
const app = express();
const authRoutes = require('./routes/auth')

app.use(require('cors')());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 7890;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
