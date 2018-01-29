import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Router, Route, Link, browserHistory } from 'react-router'
import {Channel} from './Channel.jsx';
import {About} from './About.jsx';
import {Login} from './Login.jsx';

export class App extends React.Component {

  static contextTypes = {
      router: PropTypes.object.isRequired
  }

    constructor(props) {
        super(props);
        this.state = {channels:[]};
    }

    componentDidMount() {
      fetch("/secured/channel", {
            credentials: 'same-origin'
      })
      .then((res) => {
        if(res.status == 401) {
          throw "Unauthorized";
        } else {
          return res.json();
        }
      }).then((json) => {
          this.setState({channels : json.channels});
      })
      .then(() => {

        this.webSocket = new WebSocket("ws://localhost:3000");
        this.webSocket.onerror = (error) => {
            console.error(error);
        };
        this.webSocket.onopen = (event) => {
          console.log("open");
          setInterval( _ =>{
            this.webSocket.send(""+Math.random() );
          }, 2000 );
        };
      }).catch((err) => {
        this.context.router.push("/login");
      });

    }

    render() {
        const list = this.state.channels.map((c) => {
            const link="/channel/"+c.id;
            return <li key={c.id}><Link to={link}>{c.title}</Link></li>
        });
        return (<div>
          <Link to="/about">About</Link>
          <ul>{list}</ul>
          {this.props.children}
        </div>);
    }

}


ReactDOM.render(

  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="login" exact component={Login} />
      <Route path="channel/:id" component={Channel} />
    </Route>
  </Router>
  , document.getElementById('app'));


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
