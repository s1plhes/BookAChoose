const express = require('express');
const cors = require('cors');
const app = express();
const errorMiddleware = require('./middleware/errorMiddleware')

const userRoutes = require('./routes/userRoutes');
const teeRoutes = require('./routes/teeRoutes');
const mugRoutes = require('./routes/mugRoutes');
const bookRoutes = require('./routes/bookRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const searchRoutes = require('./routes/searchRoute');
const LogoutRoute = require('./routes/logout')
const apiUrl = '/api'

app.use(cors());
app.use(express.json());

app.use(apiUrl, userRoutes)
app.use(apiUrl, teeRoutes)
app.use(apiUrl, mugRoutes)
app.use(apiUrl, bookRoutes)
app.use(apiUrl, chapterRoutes)
app.use(apiUrl, searchRoutes)
app.use(apiUrl, LogoutRoute)
app.use(errorMiddleware);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports = app