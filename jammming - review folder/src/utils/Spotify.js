let accessToken, expiresIn, userId, playListId;
const clientId = 'd0caee83c64d4ed3b2253d9786679117';
const redirectUri = 'http://localhost:3000/';
//const clienSecret = 'f2410cc04a2f4a2e8b2de68f47d5c5fa';
const authorizeUrl = "https://accounts.spotify.com/authorize";

export const Spotify = {
  getAccessToken() {
    if(!accessToken) {
      console.log(window.location.href.match(/access_token=[^&]*/) !== null);
      if(window.location.href.match(/access_token=[^&]*/) !== null) {
        accessToken = window.location.href.match(/access_token=[^&]*/)[0];
        accessToken = accessToken.replace(/access_token=/, '');
        if(window.location.href.match(/expires_in=[^&]*/) !== null) {
          expiresIn = window.location.href.match(/expires_in=[^&]*/)[0];
          expiresIn = expiresIn.replace(/expires_in=/, '');
        }
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else if(!accessToken && window.location.href.match(/access_token=[^&]*/) === null) {
        window.location.href = `${authorizeUrl}?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        accessToken = window.location.href.match(/access_token=[^&]*/)[0];
        accessToken = accessToken.replace(/access_token=/, '');
        if(window.location.href.match(/expires_in=[^&]*/) !== null) {
          expiresIn = window.location.href.match(/expires_in=[^&]*/)[0];
          expiresIn = expiresIn.replace(/expires_in=/, '');
        }
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      }
    } else {
      return accessToken;
    }
  },

  search(term) {
    accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {headers: {Authorization: 'Bearer ' + accessToken}})
      .then(response => response.json())
      .then(jsonResponse => {
        if(jsonResponse.tracks.items) {
          return jsonResponse.tracks.items.map(item => {
            return {
              ID: item.id,
              Name: item.name,
              Artist: item.artists[0].name,
              Album: item.album.name,
              URI: item.uri
            }
          })
        }
      })
  },

  savePlayList(name, trackURIs) {
    accessToken = Spotify.getAccessToken();
    if(name || trackURIs) {
      return fetch(`https://api.spotify.com/v1/me`,
        {headers: {Authorization: 'Bearer ' + accessToken}})
        .then(response => response.json())
        .then(jsonResponse => {
          if(jsonResponse.id) {
            userId = jsonResponse.id;
            fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
              {method: 'POST',
              headers: {Authorization: 'Bearer ' + accessToken},
              body: JSON.stringify({name: name,
                      public: true})})
              .then(response => response.json())
              .then(jsonResponse => {
                playListId = jsonResponse.id;
                fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`,
                  {method: 'POST',
                  headers: {Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'},
                  body: JSON.stringify({uris: trackURIs})})
                  .then(response => response.json())
                  .then(jsonResponse => {
                    return jsonResponse.id;
                  });
              });
          }
        });
    } else {
      return;
    }
  }
};
