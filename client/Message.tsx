import * as React from 'react';
import * as Styles from './Message.css';

export const Message: React.SFC<{date: number, text:string, user:any}> = (props) => {

  const date = new Date(props.date);
  const titleTime = date.toLocaleDateString()+" "+date.toLocaleTimeString();
  const textHtml = {__html:props.text};
  const avatarUrl="/secured/users/"+props.user.id+"/avatar";
  return (
      <li className={Styles.box}>
        <div style={{display:'inline-block'}}>
          <img src={avatarUrl} />
        </div>
        <div style={{display:'inline-block', padding:'0.5em'}}>
          <span className={Styles.user} >
            {props.user.fullname}
          </span>
          <span className={Styles.time} title={titleTime}>
            {date.toLocaleTimeString()}
          </span>
          <div className={Styles.text} dangerouslySetInnerHTML={textHtml}/>
        </div>
      </li>);
}
