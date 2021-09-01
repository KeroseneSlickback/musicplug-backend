// Required dependencies
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
require('./db/mongoose');
require('dotenv').config();

// Required components

// Required variables

const PORT = process.env.PORT || 3000;

// Required routes
const user_router = require('./routers/user_router');
const post_router = require('./routers/post_router');

// Global middleware
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

// Required middleware routes
app.use('/users', user_router);
app.use('/posts', post_router);

// test routes
app.get('/', (req, res) => {
	res.json({ message: 'Test GET' });
});

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
	// JSON error-handling?
});

// Listen
app.listen(PORT, () =>
	console.log(`Backend of MusicPlug is listening on port ${PORT}`)
);
