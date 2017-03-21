import React from 'react';
import {Message} from './Message.jsx';

export class Room extends React.Component {
    static contextTypes = {
        token: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            messages: []
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.token) {
            fetch("/secured/room/" + nextProps.id, {
                headers: {
                    "Authorization": "JWT " + nextContext.token
                }
            }).then((res) => {
                return res.json();
            }).then((json) => {
                this.setState(json);
            })
        }
    }

    render() {
        var list = this.state.messages.map((msg) => {
            return <Message key={msg.id} user={this.state.users[msg.userId]} {...msg}/>
        });
        return <ul className="mad-list">{list}</ul>;
    }

}
