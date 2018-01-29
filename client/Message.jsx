import React from 'react';
import Styles from './Message.css';
const moment = require('moment');

export const Message = (props) => {

      const titleHtml = {__html:props.text};
      const avatarUrl="/secured/users/"+props.user.id+"/avatar";
      return (
          <li>
            <div>
              <img src={avatarUrl} />
            </div>
            <div>
              <p>
                <strong>{props.user.fullname}</strong>
                <br/>
                Posted : <span>{moment(new Date(props.date)).fromNow()}</span>
                <br/>
              </p>
              <div dangerouslySetInnerHTML={titleHtml}/>
            </div>
          </li>);
}
