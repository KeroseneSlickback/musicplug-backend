const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '../config', 'id_rsa_priv.pem');
// const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

function issueJWT(user) {
	const _id = user._id;
	// const expiresIn = '1d';
	const payload = {
		sub: _id,
		iat: Date.now(),
	};

	const signedToken = jwt.sign(payload, process.env.PRIV_KEY, {
		// expiresIn: 24 * 60 * 60 * 1000,
		algorithm: 'RS256',
	});

	return {
		token: 'Bearer ' + signedToken,
		// expires: expiresIn,
	};
}

module.exports.issueJWT = issueJWT;
