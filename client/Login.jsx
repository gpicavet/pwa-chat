import React from 'react';
import PropTypes from 'prop-types';

export class Login extends React.Component {

  static contextTypes = {
      router: PropTypes.object.isRequired
  }

  constructor(props) {
      super(props);
      this.state = {
        form_email: "",
        form_password: ""
      };
  }

  validateForm() {
    return this.state.form_email.length > 0 && this.state.form_password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleAuth = event => {
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
      <form onSubmit={this.handleAuth}>
        <input
          id="form_email"
          name="email"
          type="email"
          placeholder="Email"
          value={this.state.email}
          onChange={this.handleChange}></input>
        <input
          id="form_password"
          name="password"
          type="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handleChange}></input>
        <button type="submit"
          disabled={!this.validateForm()}>Validate</button>
      </form>
    );
  }
}
