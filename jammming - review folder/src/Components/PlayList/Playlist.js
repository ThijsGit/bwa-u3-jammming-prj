import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList';

export class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    //this.props.onNameChange = this.props.onNameChange.bind(this);
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  render() {
    return (
      <div className="Playlist">
        <input defaultValue={this.props.playListName} onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playListTracks} onAction={this.props.onAction} isAdd={this.props.isAdd} />
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}
