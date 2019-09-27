import M from "materialize-css";
import React, { Component } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ls from "local-storage";
import { NavLink } from "react-router-dom";
import "./appliedUser.css";

class AppliedUser extends Component {
  state = {};
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("applied user component mounted");
    let tk = ls.get("user");
    if (tk === null) {
      window.location.href = "/";
    }
    let dc = jwt_decode(tk);
    // console.log(dc);
    if (dc.role[0].roleName == "SUPER_ADMIN") {
      this.setState({ role: "SA" });
    } else {
      this.setState({ role: "OA" });
      window.location.href = "/";
    }
    axios
      .get(
        "https://139.59.91.220:8443/bloodbank/api/bloodBank/v1/exhort/get/all/unapproved/users"
      )
      .then(result => {
        this.setState({ data: result.data });
      });
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems, {});
    elems = document.querySelectorAll(".dropdown-trigger");
    instances = M.Dropdown.init(elems, {});
    document.addEventListener("DOMContentLoaded", function() {
      elems = document.querySelectorAll(".dropdown-trigger");
      instances = M.Dropdown.init(elems, {
        closeOnClick: true,
        hover: true,
        autoTrigger: true
      });
    });
  };

  componentDidUpdate = () => {
    let elems = document.querySelectorAll(".dropdown-trigger");
    let instances = M.Dropdown.init(elems, {
      closeOnClick: true,
      hover: true,
      autoTrigger: true
    });
    elems = document.querySelectorAll(".sidenav");
    instances = M.Sidenav.init(elems, {});
  };

  getAppliedUser = () => {
    axios
      .get(
        "https://139.59.91.220:8443/bloodbank/api/bloodBank/v1/exhort/get/all/unapproved/users"
      )
      .then(result => {
        this.setState({ data: result.data });
      });
  };

  componentWillUnmount() {
    console.log("applied user component unmounted");
  }

  handleTablePrint = param => {
    if (param === null || param === undefined) {
      return;
    }
    let data = param.data;
    console.log(data);
    if (data.length == 0) {
      document.getElementById("data-result").innerHTML = "No Data To Show";
      return;
    }
    document.getElementById("data-result").innerHTML = "";
    var donorList = data.map(function(data, index) {
      return (
        <tr key={index}>
          <td>{data.user_name}</td>
          <td>{data.email}</td>
          <td>{data.org_name}</td>
          <td>
            <button
              className="waves-effect waves-light btn-large"
              onClick={() =>
                axios
                  .put(
                    "https://139.59.91.220:8443/bloodbank/api/bloodBank/v1/exhort/approve/" +
                      data.user_id
                  )
                  .then(result => {
                    console.log(result);
                    if (result.data.status === "OK") {
                      this.getAppliedUser();
                    }
                  })
              }
            >
              Approve
            </button>
          </td>
        </tr>
      );
    });
    return <tbody id="data-input-field">{donorList}</tbody>;
  };

  handleLogOut = () => {
    ls.set("user", null);
    window.location.href = "/";
  };

  handleNav = param => {
    if (param.role == "SA") {
      return (
        <nav>
          <div className="nav-wrapper teal">
            <div className="container">
              <a href="#" className="brand-logo">
                Logo
              </a>
              <a href="#" data-target="mobile-demo" className="sidenav-trigger">
                <i className="material-icons">menu</i>
              </a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  <NavLink to="/applieduser">Applied User</NavLink>
                </li>
                <li>
                  <NavLink to="/donorlist">Donor List</NavLink>
                </li>
                <li>
                  <NavLink to="/donortable">Donor Table</NavLink>
                </li>

                <li>
                  <a
                    className="dropdown-trigger"
                    href="#!"
                    data-target="dropdown1"
                  >
                    Other
                    <i className="material-icons right">arrow_drop_down</i>
                  </a>
                </li>
                <li>
                  <button
                    className="logout-btn"
                    onClick={this.handleLogOut.bind(this)}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
              <ul id="dropdown1" className="dropdown-content">
                <li>
                  <a href="#!">Add Blood Group</a>
                </li>
                <li>
                  <a href="#!">Add Blood Elements</a>
                </li>
              </ul>
              <ul className="sidenav" id="mobile-demo">
                <li>
                  <NavLink to="/applieduser">Applied User</NavLink>
                </li>
                <li>
                  <NavLink to="/donorlist">Donor List</NavLink>
                </li>
                <li>
                  <NavLink to="/donortable">Donor Table</NavLink>
                </li>
                <li>
                  <NavLink to="/donortable">Other</NavLink>
                </li>
                <li>
                  <a
                    className="logout-sidenav-btn"
                    onClick={this.handleLogOut.bind(this)}
                  >
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    } else {
      return (
        <nav>
          <div className="nav-wrapper teal">
            <div className="container">
              <a href="#" className="brand-logo">
                Logo
              </a>
              <a href="#" data-target="mobile-demo" className="sidenav-trigger">
                <i className="material-icons">menu</i>
              </a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  <NavLink to="/donorlist">Donor List</NavLink>
                </li>
                <li>
                  <NavLink to="/donortable">Donor Table</NavLink>
                </li>
                <li>
                  <button
                    className="logout-btn"
                    onClick={this.handleLogOut.bind(this)}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
              <ul className="sidenav" id="mobile-demo">
                <li>
                  <NavLink to="/donorlist">Donor List</NavLink>
                </li>
                <li>
                  <NavLink to="/donortable">Donor Table</NavLink>
                </li>
                <li>
                  <NavLink to="/donortable">Other</NavLink>
                </li>
                <li>
                  <button
                    className="logout-btn"
                    onClick={this.handleLogOut.bind(this)}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="row header-bar">{this.handleNav(this.state)}</div>
        <div className="row">
          <div id="test"></div>
          <div className="container">
            <div className="row">
              <table className="highlight centered col s12">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Approve</th>
                  </tr>
                </thead>
                {this.handleTablePrint(this.state.data)}
              </table>
              <p id="data-result" className="center-align"></p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AppliedUser;
