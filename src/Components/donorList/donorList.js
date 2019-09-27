import { Bar } from "react-chartjs-2";
import M from "materialize-css";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ls from "local-storage";
import "./donorList.css";
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
    // document.addEventListener("DOMContentLoaded", function() {
    //     var elems = document.querySelectorAll(".modal");
    //     var instances = M.Modal.init(elems, {});
    //     elems = document.querySelectorAll("select");
    //     instances = M.FormSelect.init(elems, {});
    //     elems = document.querySelectorAll(".autocomplete");
    //     instances = M.Autocomplete.init(elems, {
    //       data: {
    //         Dhaka: null,
    //         Barisal: null,
    //         Chittagong: null,
    //         Rangpur: null,
    //         Khulna: null,
    //         Rajshahi: null,
    //         Mymanshing: null,
    //         Sylhet: null
    //       }
    //     });
    //   });
    //   axios.get("http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/doner/all/doners").then(result => console.log(result.data));
  }
  componentDidUpdate = () => {
    let elems = document.querySelectorAll(".dropdown-trigger");
    let instances = M.Dropdown.init(elems, {
      closeOnClick: true,
      hover: true,
      autoTrigger: true
    });
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

  componentWillUnmount() {
    console.log("donorlist component unmounted");
  }
  render() {
    return (
      <React.Fragment>
        <div className="row header-bar">{this.handleNav(this.state)}</div>
        <div className="container">
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
