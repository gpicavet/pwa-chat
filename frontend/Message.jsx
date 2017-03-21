import React from 'react';
var moment = require('moment');

export const Message = (props) => {

      var titleHtml = {__html:props.text};
      var img={
        backgroundImage: 'url(' + (props.user.avatar===null ?
        "/img/UserAvtDefault.png":props.user.avatar) + ')'
      }
      return (
          <li>
              <div className="mad-list-icon">
                <span className="mad-icon-80" style={img} />
              </div>
              <div className="mad-list-text">
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
