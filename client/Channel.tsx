import * as React from 'react';
import * as PropTypes from 'prop-types';

import {Message} from './Message';
import * as Styles from './Channel.css';

export class Channel extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            messages: [],
            msg:""
        };
    }

    componentDidMount() {
            fetch("/secured/channel/" + this.props.params.id, {
              credentials: 'same-origin'
            }).then((res) => {
                return res.json();
            }).then((json) => {
                this.setState(json);
            });
    }

    componentWillReceiveProps(props:any) {
            fetch("/secured/channel/" + props.params.id, {
              credentials: 'same-origin'
            }).then((res) => {
                return res.json();
            }).then((json) => {
                this.setState(json);
            });
    }

    handleChange = (event:any) => {
      this.setState({
        [event.target.id]: event.target.value
      });
    }


    render() {
        const list = this.state.messages.map((msg:any) => {
            return <Message key={msg.id} user={this.state.users[msg.userId]} {...msg}/>
        });
        return (
        <div className={Styles.wrapper}>
          <div className={Styles.header}># Channel {this.props.params.id}</div>
          <ul className={Styles.body}>{list}</ul>
          <div className={Styles.footer}>
            <input id="msg" type="text"
              value={this.state.msg}
              onChange={this.handleChange}/>
          </div>
        </div> );

    }

}
