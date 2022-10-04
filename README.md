# MusicPlug Backend

The accompanied frontend can be found here: https://github.com/KeroseneSlickback/musicplug-frontend#readme

---

The MusicPlug backend offers full-fledged CRUD functionality.

## Technologies

- Node/Express
- Spotify API route handling
- Mongoose/MongoDB
- Passport-JWT
- BcryptJS
- Express-Validator/Validator
- Helmet
- Dotenv
- Date-Fns
- Morgan
- Sharp

### Features

- User create/read/update/delete
- Post create/read/update/delete
- Comment slot create/read/delete

### Challenges Faced

User icon images are saved to the database as buffers after being sanitized, cropped, and compressed.

Spotify API route handling. Users are directed to Spotify to authorize with their system, before being handed back to MusicPlug's backend and then redirected to the frontend for security reasons.
