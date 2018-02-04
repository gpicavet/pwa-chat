import * as React from 'react';
import * as PropTypes from 'prop-types';

import * as Styles from './Login.css';

export class Login extends React.Component<any,any> {

  static contextTypes = {
      router: PropTypes.object.isRequired
  }

  constructor(props:any) {
      super(props);
      this.state = {
        form_email: "",
        form_password: ""
      };
  }

  validateForm() {
    return this.state.form_email.length > 0 && this.state.form_password.length > 0;
  }

  handleChange = (event:any) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleAuth = (event:any) => {
    event.preventDefault();
    fetch("/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            email: this.state.form_email,
            password: this.state.form_password
        })
    }).then((res) => {
      if(res.status == 200) {
        this.context.router.push("/");
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleAuth} className={Styles.form}>
        <input
          id="form_email"
          name="email"
          type="email"
          placeholder="Email"
          value={this.state.form_email}
          onChange={this.handleChange}
          className={Styles.input}></input>
        <input
          id="form_password"
          name="password"
          type="password"
          placeholder="Password"
          value={this.state.form_password}
          onChange={this.handleChange}
          className={Styles.input}></input>
        <button type="submit"
          disabled={!this.validateForm()}
          className={Styles.button}>Validate</button>
      </form>
    );
  }
}
