import React from 'react';
import ReactDOM from 'react-dom';
import {Room} from './Room.jsx';

export class App extends React.Component {
    static childContextTypes = {
      token: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {token : null};
    }

    getChildContext() {
      return {token: this.state === null ? null : this.state.token};
    }

    componentDidMount() {
      fetch("/token", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              email: "gpicavet@gmail.com",
              password: "pass"
          })
      }).then((res) => {
          return res.json();
      }).then((json) => {
        console.log("app did mount 2");
          this.setState({token : json.token});
      })

    }

    render() {
        console.log("app render");
        return <Room id={1}/>;
    }

}


ReactDOM.render(
    <App/>, document.getElementById('app'));


/*
if ('serviceWorker' in navigator) {
    const register = require('service-worker?filename=sw.js!./sw.js');

    register().then((reg) => {
        console.log('Successfully registered service worker', reg);
    }).catch((err) => {
        console.warn('Error whilst registering service worker', err);
    });
}
*/
