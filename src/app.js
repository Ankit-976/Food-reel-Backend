//create a server using express
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes')
const foodPartnerRoutes = require('./routes/foodPartner.routes');
const cors = require('cors')

const app = express();

app.use(cors({
    origin: "https://food-reel-frontend-theta.vercel.app/",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;
