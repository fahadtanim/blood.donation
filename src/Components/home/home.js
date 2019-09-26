import M from "materialize-css";
import React, { Component } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ls from "local-storage";
import { Redirect } from "react-router";
class Home extends Component {
  state = {};
  constructor() {
    super();
  }
  componentDidMount() {
    console.log("home component mounted");
    // document.addEventListener("DOMContentLoaded", function() {

    // });

    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems, {});
    elems = document.querySelectorAll("select");
    instances = M.FormSelect.init(elems, {});
    elems = document.querySelectorAll(".autocomplete");
    instances = M.Autocomplete.init(elems, {
      data: {
        Dhaka: null,
        Barisal: null,
        Chittagong: null,
        Rangpur: null,
        Khulna: null,
        Rajshahi: null,
        Mymanshing: null,
        Sylhet: null
      }
    });

    // axios.get("http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/doner/all/doners").then(result => console.log(result.data));
    axios
      .get(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/exhort/get/all/unapproved/users"
      )
      .then(result => {
        console.log(result.data);
      });
  }

  componentWillUnmount() {
    console.log("home component unmounted");
  }

  handleRegisterFormSubmit = () => {
    let user = {
      user_name: document.getElementById("register_user_name").value,
      email: document.getElementById("register_email").value,
      password: document.getElementById("register_password").value,
      org_name: document.getElementById("register_org_name").value
    };
    axios
      .post(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/signup/add/new",
        user
      )
      .then(result => {
        console.log(result.data);
      });
  };

  handleSignInFormSubmit = () => {
    let user = {
      username: document.getElementById("sign_in_user_name").value,
      password: document.getElementById("sign_in_password").value
    };

    console.log(user);
    axios
      .post(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/exhort/login",
        user
      )
      .then(result => {
        let token = result.data.data;

        if (result.data.status === "OK") {
          ls.set("user", token);
          let decoded = jwt_decode(token);
          console.log(ls.get("user"));
          console.log(decoded);
          if (decoded.role[0].roleName === "SUPER_ADMIN") {
            this.props.history.push("/applieduser");
          } else {
            this.props.history.push("/donorlist");
          }
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row header-bar"></div>
        <div className="container">
          <div className="row">
            <div className="col s12 m10 l10">
              <div className="card white darken-1">
                <div className="card-content z-depth-0 red-text">
                  <span className="card-title center">
                    BLOOD DONATION REDUCES RISK OF CANCER, HYPERTENSION AND
                    HEART DISEASE
                  </span>
                </div>
              </div>

              <form className="col s12" action="">
                <div className="input-field row">
                  <span className="col s12 teal-text center-align">
                    Which Blood Group Do You Need?
                  </span>
                  <span className="col s12 teal-text center-align">
                    আপনি কোন গ্রুপের রক্ত খুঁজছেন ?
                  </span>
                  <div className="col s3"></div>
                  <div className="col s6">
                    <select className="row" defaultValue="0">
                      <option value="0" disabled>
                        Blood Group / রক্তের গ্রুপ
                      </option>
                      <option value="1">A(+)ve</option>
                      <option value="2">A(-)ve</option>
                      <option value="3">B(+)ve</option>
                      <option value="4">B(-)ve</option>
                      <option value="5">O(+)ve</option>
                      <option value="6">O(-)ve</option>
                      <option value="7">AB(+)ve</option>
                      <option value="8">AB(-)ve</option>
                    </select>
                  </div>
                </div>
                <div className="input-field row">
                  <span className="col s12 teal-text center-align">
                    Which Blood Product Do You Need?
                  </span>
                  <span className="col s12 teal-text center-align">
                    আপনার রক্তের কোন উপাদানটি প্রয়োজন
                  </span>
                  <div className="col s2"></div>
                  <div className="col s8">
                    <select className="row" defaultValue="0">
                      <option value="0" disabled>
                        e.g. Whole Blood/Apheresis Platelets/FFP etc
                      </option>
                      <option value="1">Whole Blood</option>
                      <option value="2">Apheresis Platelets</option>
                      <option value="3">FFP</option>
                    </select>
                  </div>
                </div>
                <div className="input-field row">
                  <span className="col s12 teal-text center-align">
                    Your Location/Where Do You Need That Blood?
                  </span>
                  <span className="col s12 teal-text center-align">
                    আপনার অবস্থান / কোথায় রক্তটি লাগবে?
                  </span>
                  <div className="col s1"></div>
                  <div className="input-field col s10">
                    <i className="material-icons prefix">location_on</i>
                    <input
                      type="text"
                      id="autocomplete-input"
                      className="autocomplete"
                    />
                    <label htmlFor="autocomplete-input">Type Address</label>
                  </div>
                </div>

                <div className="input-field">
                  <div className="col s6 left-align">
                    <button
                      className="btn waves-effect waves-light"
                      type="submit"
                      name="action"
                    >
                      Urgent Search
                    </button>
                  </div>
                  <div className="col s6 right-align">
                    <button
                      className="btn waves-effect waves-light"
                      type="submit"
                      name="action"
                    >
                      Search Within 24 Hours
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col m12 l2 center" style={{ padding: "1em" }}>
              <a
                className="row waves-effect waves-light btn-large modal-trigger"
                href="#signInModal"
              >
                Sign In
              </a>
              <a
                className="row waves-effect waves-light btn-large modal-trigger"
                href="#registerModal"
              >
                Register
              </a>
            </div>
            <div className="col s12 m10 l10 center-align teal-text boyan-text">
              <h6 className="center-align">
                Developed in Collaboration with Sandhani and Exhort
              </h6>
              <h6 className="center-align">Sponsored by: Dhaka Bank Ltd.</h6>
            </div>
          </div>
        </div>

        <div id="signInModal" className="modal modal-fixed-footer">
          <div className="modal-content">
            <div className="row">
              <div className="input-field col s12">
                <input id="sign_in_user_name" type="text" />
                <label htmlFor="sign_in_user_name">User name</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input id="sign_in_password" type="password" />
                <label htmlFor="sign_in_password">Password</label>
              </div>
            </div>
            <div className="row">
              <button
                className="modal-close row waves-effect waves-light btn-large"
                onClick={this.handleSignInFormSubmit}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        <div id="registerModal" className="modal">
          <div className="modal-content">
            <div className="row">
              <div className="col s12">
                <div className="row">
                  <div className="input-field col s12">
                    <input id="register_user_name" type="text" />
                    <label htmlFor="register_user_name">User name</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input id="register_password" type="password" />
                    <label htmlFor="register_password">Password</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input id="register_org_name" type="text" />
                    <label htmlFor="register_org_name">Organization Name</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      id="register_email"
                      type="email"
                      className="validate"
                    />
                    <label htmlFor="register_email">Email</label>
                    <span
                      className="helper-text"
                      data-error="wrong"
                      data-success="right"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div>
              <button
                className="modal-close waves-effect waves-teal btn-flat"
                onClick={this.handleRegisterFormSubmit}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
