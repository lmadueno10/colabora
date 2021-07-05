const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
const colegiosRoutes = require('./routes/api/colegios_controller')
const app = express();
app.use(cors())
app.use(express.json());
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

app.use('/api/colegios', colegiosRoutes);
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));