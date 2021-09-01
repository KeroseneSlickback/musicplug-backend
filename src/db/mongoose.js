// Mongoose connection stuff here
const mongoose = require('mongoose');

mongoose
	.connect(process.env.MONGODB_URL, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		// useCreateIndex: true,
		// useFindAndModify: false,
	})
	.then(() => {
		console.log(
			`MongoDB successfully connected. Database URL: ${process.env.MONGODB_URL}`
		);
	})
	.catch(error => {
		console.log(
			`Error establishing MongoDB connection. Error: ${error.message}`
		);
	});
