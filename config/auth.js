module.exports = {
  'googleAuth': {
    'clientID': process.env.google_client_id,
    'clientSecret': process.env.google_client_secret,
    'callbackURL': 'https://bechdaal.tech/auth/google/callback'
  },
  'facebookAuth': {
    'clientID': process.env.facebook_client_id,
    'clientSecret': process.env.facebook_client_secret,
    'callbackURL': 'https://bechdaal.tech/auth/facebook/callback',
    'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    'profileFields': ['id','displayName','emails']
  },
};
