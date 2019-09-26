import M from "materialize-css";
import React, { Component } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ls from "local-storage";
import { Redirect } from "react-router";
import "./home.css";
class Home extends Component {
  state = {};
  constructor(props) {
    super(props);
    // this.props.handleLogOut.bind(this);
  }
  componentDidMount() {
    console.log("home component mounted");

    // document.addEventListener("DOMContentLoaded", function() {

    // });
    let tk = ls.get("user");
    console.log(tk);
    if (tk === null) {
      this.setState({ logged_in: false });
    } else {
      this.setState({ logged_in: true });
    }

    if(tk){
      let dc = jwt_decode(tk);
      if(dc.role[0].roleName === "SUPER_ADMIN"){
        window.location.href = "/applieduser";
      }
      else{
        window.location.href = "/donorlist";
      }
    }
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
    let bg = { blood_group: "A-" };
    // axios.post("http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/blood/group/add",bg).then(result => console.log(result));
    axios
      .get(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/blood/group/all"
      )
      .then(result => {
        console.log(result);
        this.setState({ blood_group: result.data });
      });

    axios
      .get(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/blood/element/all"
      )
      .then(result => {
        this.setState({ blood_elements: result.data });
      });

    axios
      .get(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/search/location/location"
      )
      .then(result => {
        this.setState({ location: result.data });
      });

    // axios.get("http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/doner/all/doners").then(result => console.log(result.data));
    // axios
    //   .get(
    //     "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/exhort/get/all/unapproved/users"
    //   )
    //   .then(result => {
    //     console.log(result.data);
    //   });
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

    // console.log(user);
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
          this.setState({logged_in :true});
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

  handleBloodElementOption = param => {
    if (param === null || param === undefined || param === "") {
      return;
    }
    let data = param.data;
    console.log(data);
    if (data.length == 0) {
      return;
    }
    var bloodGroupList = data.map(function(data, index) {
      return (
        <option key={index} value={data.element_name}>
          {data.element_name}
        </option>
      );
    });
  };

  handleBloodGroupOption = param => {
    if (param === null || param === undefined || param === "") {
      return;
    }
    let data = param.data;
    console.log(data);
    if (data.length == 0) {
      return;
    }
    var bloodGroupList = data.map(function(data, index) {
      return (
        <option key={index} value={data.blood_group}>
          {data.blood_group}
        </option>
      );
    });

    console.log(param);
    return <React.Fragment>{bloodGroupList}</React.Fragment>;
  };

  handleSelectBtn = () => {
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems, {});
  };

  handleLocationSearch = () => {
    console.log("came");
  };

  handleLogOut(){
    console.log("test");
    ls.set("user",null);
    this.setState({logged_in:false})
  }

  toggleLoginBtn = param=>{
    if (
      param.logged_in == false
    ) {
      return (
        <div className="header-bar-container">
          <a className="sign-in-btn modal-trigger" href="#signInModal">
            Sign In
          </a>
          <a className="sign-up-btn modal-trigger" href="#registerModal">
            Sign Up
          </a>
        </div>
      );
    }
    else{
      return;
    }
  }
  toggleLogoutBtn = param => {
    if (
      param.logged_in == true
    ) {
      return (
        <div className="header-bar-container">
          <button className="sign-up-btn" onClick = {this.handleLogOut.bind(this)}>
            Log Out
          </button>
        </div>
      );
    }
  };


  
  render() {
    return (
      <React.Fragment>
        <div className="row header-bar">
          {/* <div className="header-bar-container" style={{ padding: "1em" }}>
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
          </div> */}
          <div className="container">
            <div className="row">
              <div className="col s6"></div>
              <div className="col s6">
                {/* <div className="header-bar-container">
                  <a className="sign-in-btn modal-trigger" href="#signInModal">
                    Sign In
                  </a>
                  <a
                    className="sign-up-btn modal-trigger"
                    href="#registerModal"
                  >
                    Sign Up
                  </a>
                </div> */}
                {this.toggleLoginBtn(this.state)}
                {this.toggleLogoutBtn(this.state)}
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col s12 m12 l12">
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
                      {this.handleBloodGroupOption(this.state.blood_group)}
                      {this.handleSelectBtn(this.state)}
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
                  <div className="col s3"></div>
                  <div className="col s6">
                    <select className="row" defaultValue="0">
                      <option value="0" disabled>
                        e.g. Whole Blood/Apheresis Platelets/FFP etc
                      </option>
                      {this.handleBloodElementOption()}
                      {this.handleSelectBtn(this.state)}
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
                  <div className="col s3"></div>
                  <div className="input-field col s6">
                    <i className="material-icons prefix">location_on</i>
                    <input
                      type="text"
                      id="autocomplete-input"
                      className="autocomplete"
                      onKeyDown={this.handleLocationSearch()}
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
            <div className="col s12 m12 l12 center-align teal-text boyan-text">
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
