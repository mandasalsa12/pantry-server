const express = require ("express"); 
const cors = require ("cors");
const dotenv = require ("dotenv");
const userRoutes = require ('./routes/userRoute');
const penyimpananRoutes = require ('./routes/penyimpananRoutes')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server berjalan');
});

app.use('/api/users', userRoutes) // router user
app.use('/api/penyimpanan', penyimpananRoutes) // router penyimpanan

app.listen(PORT, () => {
    console.log(`Server berjalan diPORT ${PORT}`);
})