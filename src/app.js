// Required dependencies
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const passport = require('passport');
require('./db/mongoose');
require('dotenv').config();
require('./lib/passport')(passport);

// Required components

// Required variables

const PORT = process.env.PORT || 8888;

// Required routes
const user_router = require('./routers/user_router');
const post_router = require('./routers/post_router');
const spotify_router = require('./routers/spotify_router');

// Global middleware
const app = express();

app.use(passport.initialize());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Required middleware routes
app.use('/users', user_router);
app.use('/posts', post_router);
app.use('/spotify', spotify_router);

app.get('*', (req, res) => {
	res.status(404).json({ message: 'Resource not found' });
});

// Catch 404
app.use(function (req, res, next) {
	next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
});

// Listen
app.listen(PORT, () =>
	console.log(`Backend of MusicPlug is listening on port ${PORT}`)
);
