import React, { Component } from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {PlayList} from '../PlayList/Playlist';
import {Spotify} from '../../utils/Spotify';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
        searchResults: [],
        playListName: "New Playlist",
        playListTracks: []
      };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    for(let i in this.state.searchResults) {
      if(this.state.searchResults[i].ID === track.ID) {
        let playListTracks = this.state.playListTracks.slice();
        playListTracks.push(track);
        this.setState({playListTracks: playListTracks});
        let searchResults = this.state.searchResults.slice();
        searchResults.splice(i, 1);
        this.setState({searchResults: searchResults});
        break;
      }
    }
  }

  removeTrack(track) {
    for(let i in this.state.playListTracks) {
      if(this.state.playListTracks[i].ID === track.ID) {
        let searchResults = this.state.searchResults.slice();
        searchResults.push(track);
        this.setState({searchResults: searchResults});
        let playListTracks = this.state.playListTracks.slice();
        playListTracks.splice(i, 1);
        this.setState({playListTracks: playListTracks});
        break;
      }
    }
  }

  updatePlayListName(name) {
    this.setState({playListName: name});
  }

  savePlayList() {
    let trackURIs = this.state.playListTracks.map(track => track.URI);
    Spotify.savePlayList(this.state.playListName, trackURIs)
    .then(this.setState({playListTracks: [], playListName: "New Playlist"}));
  }

  search(term) {
    Spotify.search(term).then(items => this.setState({searchResults: items}));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAction={this.addTrack} isAdd={true} />
            <PlayList playListName={this.state.playListName} playListTracks={this.state.playListTracks} onAction={this.removeTrack} isAdd={false} onNameChange={this.updatePlayListName} onSave={this.savePlayList} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
