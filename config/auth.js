module.exports = {
  'googleAuth': {
    'clientID': process.env.google_client_id,
    'clientSecret': process.env.google_client_secret,
    'callbackURL': 'https://bechdaal.tech/auth/google/callback'
  },
  'facebookAuth': {
    'clientID': '3750670981613060',
    'clientSecret': '20cb37f1f5a6ecacb6f572f43a5df5a3',
    'callbackURL': 'https://bechdaal.tech/auth/facebook/callback',
    'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    'profileFields': ['id']
  },
};
