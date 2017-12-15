import React from 'react';
import './Track.css';

export class Track extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  renderAction(isAdd) {
    if(isAdd) {
      return "+";
    } else {
      return "-";
    }
  }

  handleClick(event) {
    //event.preventDefault();
    this.props.onAction(this.props.track);
    /*this.setState({isAdd: !this.state.isAdd}, () => {
      console.log("2: " + this.state.isAdd);
    });*/
  }

  render() {
    return(
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.Name}</h3>
          <p>{this.props.track.Artist}" | "{this.props.track.Album}</p>
        </div>
        <a className="Track-action" onClick={this.handleClick.bind(this)}>{this.renderAction(this.props.isAdd)}</a>
      </div>
    );
  }
}
