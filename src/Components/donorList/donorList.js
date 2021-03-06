import { Bar } from "react-chartjs-2";
import M from "materialize-css";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { config } from "../../services/config";
import ls from "local-storage";
import "./donorList.css";
import Header from "../header/header";
class DonorList extends Component {
  state = {
    data: {
      labels: [
        "A(+)ve",
        "A(-)ve",
        "B(+)ve",
        "B(-)ve",
        "O(+)ve",
        "O(-)ve",
        "AB(+)ve",
        "AB(-)ve"
      ],
      datasets: [
        {
          label: "Donation Amount",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40, 60, 0]
        }
      ]
    }
  };
  componentDidMount() {
    console.log("donorlist component mounted");
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
    }
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems, {});
  }

  componentDidUpdate = () => {
    let elems = document.querySelectorAll(".dropdown-trigger");
    let instances = M.Dropdown.init(elems, {
      closeOnClick: true,
      hover: true,
      autoTrigger: true
    });
    elems = document.querySelectorAll(".modal");
    // console.log(elems);
    instances = M.Modal.init(elems, {});
    instances.forEach(data => data.close());
  };

  handleLogOut = () => {
    ls.set("user", null);
    window.location.href = "/";
  };

  handleAddBloodGroup = () => {
    let bloodGroup = {
      blood_group: document.getElementById("new-blood-group-name").value
    };
    axios
      .post(
        config.apiUrl + "/bloodbank/api/bloodBank/v1/blood/group/add",
        bloodGroup
      )
      .then(result => {
        if (result.data.status === "OK") {
          M.toast({ html: "Blood Group Add" });
          axios
            .get(config.apiUrl + "/bloodbank/api/bloodBank/v1/blood/group/all")
            .then(result => {
              // console.log(result);
              this.setState({ blood_group: result.data });
            });
        } else {
          M.toast({ html: "Couldn't Add Blood Group" });
        }
      });
  };
  handleAddBloodElement = () => {
    let bloodElement = {
      element_name: document.getElementById("new-blood-element-name").value
    };
    axios
      .post(
        config.apiUrl + "/bloodbank/api/bloodBank/v1/blood/element/add",
        bloodElement
      )
      .then(result => {
        if (result.data.status === "OK") {
          M.toast({ html: "Blood Element Added" });
          axios
            .get(
              config.apiUrl + "/bloodbank/api/bloodBank/v1/blood/element/all"
            )
            .then(result => {
              // console.log("blood element");
              // console.log(result);
              this.setState({ blood_elements: result.data });
            });
        } else {
          M.toast({ html: "Couldn't Add Blood Element" });
        }
      });
  };
  handleAddCommunity = () => {
    let community = {
      community_name: document.getElementById("new-community-group-name").value
    };
    console.log("community :");
    console.log(community);
    axios
      .post(
        config.apiUrl + "/bloodbank/api/bloodBank/v1/community/add",
        community
      )
      .then(result => {
        if (result.data.status === "OK") {
          M.toast({ html: "Community Group Added" });
          axios
            .get(config.apiUrl + "/bloodbank/api/bloodBank/v1/community/all")
            .then(result => {
              console.log("community group : ");
              console.log(result);
              this.setState({ community_group: result.data });
            });
        } else {
          M.toast({ html: "Couldn't Add Community Group" });
        }
      });
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
                  <a className="dropdown-trigger" data-target="dropdown1">
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
              <div id="addNewBloodGroupModal" className="modal">
                <div className="modal-content">
                  <div className="container">
                    <div className="row">
                      <div className="col s12">
                        <label>Name of Blood Group:</label>
                        <input
                          id="new-blood-group-name"
                          type="text"
                          name="blood_group"
                        />
                      </div>
                      <div className="col s12">
                        <button
                          className="btn waves-effect waves-light modal-close"
                          onClick={this.handleAddBloodGroup}
                        >
                          Add Blood Group
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="addNewBloodElementModal" className="modal">
                <div className="modal-content">
                  <div className="container">
                    <div className="row">
                      <div className="col s12">
                        <label>Name of Blood Element:</label>
                        <input
                          id="new-blood-element-name"
                          type="text"
                          name="blood_element"
                        />
                      </div>
                      <div className="col s12">
                        <button
                          className="btn waves-effect waves-light modal-close"
                          onClick={this.handleAddBloodElement}
                        >
                          Add Blood Element
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="addNewCommunityModal" className="modal">
                <div className="modal-content">
                  <div className="container">
                    <div className="row">
                      <div className="col s12">
                        <label>Name of Blood Community:</label>
                        <input
                          id="new-community-group-name"
                          type="text"
                          name="community_group"
                        />
                      </div>
                      <div className="col s12">
                        <button
                          className="btn waves-effect waves-light modal-close"
                          onClick={this.handleAddCommunity}
                        >
                          Add Community
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ul id="dropdown1" className="dropdown-content">
                <li>
                  <a
                    href="#addNewBloodGroup"
                    className="modal-trigger"
                    data-target="addNewBloodGroupModal"
                  >
                    Add Blood Group
                  </a>
                </li>
                <li>
                  <a
                    href="#addNewBloodElement"
                    className="modal-trigger"
                    data-target="addNewBloodElementModal"
                  >
                    Add Blood Elements
                  </a>
                </li>
                <li>
                  <a
                    href="#addNewCommunity"
                    className="modal-trigger"
                    data-target="addNewCommunityModal"
                  >
                    Add Community Group
                  </a>
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

  componentWillUnmount() {
    console.log("donorlist component unmounted");
  }
  render() {
    return (
      <React.Fragment>
        <div className="row header-bar">{this.handleNav(this.state)}</div>
        {/* <Header></Header> */}
        <div className="container pad-bottom-container">
          <div className="row">
            <div className="menu-container">
              <button className="waves-effect waves-light btn">Leader</button>
              <button className="waves-effect waves-light btn">Tester</button>
              <NavLink
                to="/donortable"
                className="waves-effect waves-light btn"
              >
                Donor
              </NavLink>
              <button className="waves-effect waves-light btn">Freezer</button>
            </div>
          </div>
          <div className="row">
            <Bar
              data={this.state.data}
              title="My amazing data"
              color="#70CAD1"
              width={500}
              height={500}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default DonorList;
