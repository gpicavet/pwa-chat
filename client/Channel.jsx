import React from 'react';
import PropTypes from 'prop-types';
import {Message} from './Message.jsx';
import Styles from './Channel.css';

export class Channel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            messages: []
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

    render() {
        const list = this.state.messages.map((msg) => {
            return <Message key={msg.id} user={this.state.users[msg.userId]} {...msg}/>
        });
        return <ul className={Styles.messageList}>{list}</ul>;
    }

}
