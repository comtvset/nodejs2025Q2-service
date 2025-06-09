export const greetings = {
  message: 'Welcome to the REST Service',
  description:
    'This is a Home Library Service! Users can create, read, update, delete data about Artists, Tracks, and Albums, and add them to Favorites in their own Home Library!',
  endpoints: {
    users: {
      basePath: '/user',
      routes: [
        'GET /user — get all users',
        'GET /user/:id — get user by ID',
        'POST /user — create a new user',
        'PUT /user/:id — update user password',
        'DELETE /user/:id — delete user',
      ],
    },
    artists: { basePath: '/artist', routes: ['GET', 'POST', 'PUT', 'DELETE'] },
    albums: { basePath: '/album', routes: ['GET', 'POST', 'PUT', 'DELETE'] },
    tracks: { basePath: '/track', routes: ['GET', 'POST', 'PUT', 'DELETE'] },
    favorites: {
      basePath: '/favs',
      routes: [
        'GET /favs — get all favorite entities',
        'POST /favs/track/:id — add track to favorites',
        'DELETE /favs/track/:id — remove track from favorites',
        'and similarly for artist and album',
      ],
    },
  },
  notes: [
    '👤 Login must be at least 2 characters',
    '🔒 Password must be a string of at least 4 characters',
    '🔄 When changing password, new and old passwords must not match',
    '❌ Errors are accompanied by appropriate HTTP status codes (400, 403, 404, etc.)',
  ],
  tip: 'Start with POST /user to create your first user and begin testing!',
};
