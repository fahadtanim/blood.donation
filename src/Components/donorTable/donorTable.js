import { Bar } from "react-chartjs-2";
import M from "materialize-css";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ls from "local-storage";
import "./donorTable.css";

class DonorTable extends Component {
  state = {};
  componentDidMount() {
    console.log("donortable Component Mounted");
    // let token = ls.get("user");
    // console.log(token);
    this.setState({ token: ls.get("user") });
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
    axios
      .get(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/blood/group/all"
      )
      .then(result => {
        console.log(result);
        this.setState({ blood_group: result.data });
      });
    // console.log();
    document.getElementById("add-new-donor-date").innerHTML = new Date();
    document.addEventListener("DOMContentLoaded", function() {
      let elems = document.querySelectorAll(".modal");
      let instances = M.Modal.init(elems, {
        onCloseEnd: () => {
          let elem = document.getElementById("onPrevDon1");
          elem.checked = true;
          elem.style.display = "none";
          elem = document.getElementById("onPrevDon2");
          elem.checked = false;
          elem.style.display = "none";
        }
      });
      elems = document.querySelectorAll("select");
      instances = M.FormSelect.init(elems, {});
    });
    axios
      .get(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/doner/all/doners"
      )
      .then(result => this.setState({ data: result.data }));

    document.getElementById("addNewBloodGroupForm").addEventListener("submit",(e)=>{
        e.preventDefault();
    })
  }

  componentDidUpdate = () => {
    let elems = document.querySelectorAll(".modal");
    let instances = M.Modal.init(elems, {
      onCloseEnd: () => {
        let elem = document.getElementById("onPrevDon1");
        elem.checked = true;
        elem.style.display = "none";
        elem = document.getElementById("onPrevDon2");
        elem.checked = false;
        elem.style.display = "none";
      }
      
    });

    elems = document.querySelectorAll('.dropdown-trigger');
     instances = M.Dropdown.init(elems, {
        closeOnClick:true,
      hover:true,
      autoTrigger:true,
      });

    elems = document.querySelectorAll("select");
    instances = M.FormSelect.init(elems, {});
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
                  <a href="#addNewBloodGroup" className ="modal-trigger" data-target="addNewBloodGroupModal">Add Blood Group</a>
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
    console.log("donortable component unmounted");
  }

  handleTablePrint = param => {
    if (param === null || param === undefined) {
      return;
    }
    let data = param.data;
    if (data.length == 0) {
      document.getElementById("data-result").innerHTML = "No Data To Show";
      return;
    }
    document.getElementById("data-result").innerHTML = "";
    let donorList = data.map(function(data, index) {
      return (
        <tr key={index}>
          <td>{data.doner_name}</td>
          <td>{data.first_address}</td>
          <td>{data.middle_address}</td>
          <td>{data.last_address}</td>
          <td>{data.mobile_number}</td>
          <td>{data.email}</td>
          <td>{data.blood_group}</td>
          {/* <td>{data.comunity_group}</td> */}
          <td>{data.previous_donation ? "Yes" : "No"}</td>
          <td>{data.number_of_previous_donation}</td>
          <td>{data.donation_data ? data.donation_data : "----------"}</td>
        </tr>
      );
    });
    return <tbody id="data-input-field">{donorList}</tbody>;
  };

  handleSearchByBloodGroup = param => {
    console.log(param);
    if (param === null || param === undefined) {
      return;
    }
    axios
      .get(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/doner/by/group/" +
          param
      )
      .then(result => this.setState({ data: result.data }));
  };

  toggleAll = () => {
    // alert("hjkhj");
    let elem = document.getElementById("onPrevDon1");
    elem.style.display = elem.style.display === "none" ? "block" : "none";

    elem = document.getElementById("onPrevDon2");
    elem.style.display = elem.style.display === "none" ? "block" : "none";
  };

  handleFormSubmit = () => {
    let decode = jwt_decode(this.state.token);
    console.log(decode);
    let donor = {
      doner_name: document.getElementById("new-donor-name").value,
      first_address: document.getElementById("new-donor-first-address").value,
      middle_address: document.getElementById("new-donor-middle-address").value,
      last_address: document.getElementById("new-donor-last-address").value,
      mobile_number: document.getElementById("new-donor-mobile-number").value,
      email: document.getElementById("new-donor-email").value,
      community_group: document.getElementById("new-donor-community-group")
        .value,
      blood_group: document.getElementById("new-donor-blood-group").value,
      previous_donation: document.getElementById(
        "new-donor-no-previous-donation"
      ).checked
        ? false
        : true,
      number_of_previous_donation: document.getElementById(
        "new-donor-no-previous-donation"
      ).checked
        ? "0"
        : document.getElementById("new-donor-total-num-previous-donation")
            .value,
      donation_data: document.getElementById("new-donor-no-previous-donation")
        .checked
        ? null
        : document.getElementById("new-donor-last-previous-donation").value,
      user_id: decode.id
    };
    console.log(donor);
    axios
      .post(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/doner/add",
        donor
      )
      .then(result => console.log(result));
  };

  handleBloodGroupList = param => {
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
        <button
          className="waves-effect waves-light btn"
          key={data.id}
          onClick={() =>
            this.handleSearchByBloodGroup.bind(this, data.blood_group)
          }
        >
          {data.blood_group}
        </button>
      );
    });
    return (
      <div className="menu-container">
        {bloodGroupList}
        <button
          className="waves-effect waves-light btn modal-trigger"
          data-target="addNewDonarModal"
        >
          Add New Donor
        </button>
      </div>
    );
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

  render() {
    return (
      <React.Fragment>
        <div className="row header-bar">{this.handleNav(this.state)}</div>
        <div className="container">
          <div className="row">
          {this.handleBloodGroupList(this.state.blood_group)}
            
          </div>
          <div className="row">
            <div id="test"></div>
            <table className="highlight centered col s12">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>First Address</th>
                  <th>Middle Address</th>
                  <th>Last Address</th>
                  <th>Mobile Number</th>
                  <th>Email</th>
                  <th>Blood Group</th>
                  <th>Previous Donation</th>
                  <th>Number of Previous Donation</th>
                  <th>Donation Date</th>
                </tr>
              </thead>
              {this.handleTablePrint(this.state.data)}
            </table>
            <p id="data-result" className="center-align"></p>
          </div>
        </div>
        <div id = "addNewBloodGroupModal" className = "modal">
            <div className = "modal-content">
                <div className="container">
                    <form className = "row" id="addNewBloodGroupForm">
                        <div className="col s12">
                        <label>Name of Blood Group:</label>
                        <input
                            id="new-blood-group-name"
                            type="text"
                            name="blood_group"
                        />
                        </div>
                        <div className="col s12"><button
                        className="btn waves-effect waves-light"
                        onClick={this.handleFormSubmit}
                      >
                        Add Donor
                      </button>
                      </div>
                    </form>
                </div>
            </div>
        </div>
        <div id="addNewDonarModal" className="modal">
          <div className="modal-content">
            <div className="container">
              <div className="row">
                <div className="col s9">
                  <h2>Add New Donor</h2>
                </div>
                <div className="col s3" id="add-new-donor-date">
                  <h6>20 Sep 2019</h6>
                </div>
              </div>

              <div className="row">
                <div>
                  <div className="row">
                    <div className="col s12">
                      <label>Name of Donor:</label>
                      <input
                        id="new-donor-name"
                        type="text"
                        name="donor_name"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12">
                      <label>community Group:</label>
                      <input
                        id="new-donor-community-group"
                        type="text"
                        name="community_group"
                      />
                    </div>
                    
                  </div>

                  <div className="row">
                    <div className="col s12">
                      <label>Address of Donor:</label>
                      <div className="row">
                        <div className="col s12 m4">
                          <input
                            id="new-donor-first-address"
                            type="text"
                            name="first_address"
                            placeholder="first address"
                          />
                        </div>
                        <div className="col s12 m4">
                          <input
                            id="new-donor-middle-address"
                            type="text"
                            name="middle_address"
                            placeholder="middle address"
                          />
                        </div>
                        <div className="col s12 m4">
                          <input
                            id="new-donor-last-address"
                            type="text"
                            name="last_address"
                            placeholder="last address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12">
                      <label htmlFor="mobile-number">Contact/Mobile:</label>
                      <input
                        type="text"
                        name="mobile-number"
                        id="new-donor-mobile-number"
                        placeholder="ex : +8801533556677"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12">
                      <label htmlFor="blood-group">Blood Group:</label>
                      <select
                        name="blood-group"
                        id="new-donor-blood-group"
                        defaultValue="0"
                      >
                          <option value = "0" disabled>ex : A+</option>
                        {this.handleBloodGroupOption(this.state.blood_group)}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12">
                      <label htmlFor="">Previous Donation:</label>
                      <p>
                        <label>
                          <input
                            id="new-donor-no-previous-donation"
                            type="radio"
                            name="prevDon"
                            onClick={this.toggleAll}
                            defaultChecked
                          />
                          <span>No Previous Donation</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input
                            id="new-donor-num-of-previous-donation"
                            type="radio"
                            name="prevDon"
                            onClick={this.toggleAll}
                          />
                          <span>N/O Previous Donation</span>
                        </label>
                      </p>
                    </div>
                  </div>

                  <div
                    className="row"
                    id="onPrevDon1"
                    style={{ display: "none" }}
                  >
                    <div className="col s12">
                      <label htmlFor="date">Last Donation:</label>
                      <input
                        id="new-donor-last-previous-donation"
                        type="date"
                        name="ld"
                      />
                    </div>
                  </div>

                  <div
                    className="row"
                    id="onPrevDon2"
                    style={{ display: "none" }}
                  >
                    <div className="col s12">
                      <label htmlFor="nod">No of Donation:</label>
                      <input
                        id="new-donor-total-num-previous-donation"
                        type="number"
                        name="nod"
                        min={1}
                        max={10000}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12">
                      <label htmlFor="">E-mail:</label>
                      <input
                        id="new-donor-email"
                        type="email"
                        name="email"
                        placeholder="example@abc.com"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12">
                      <button
                        className="btn waves-effect waves-light"
                        onClick={this.handleFormSubmit}
                      >
                        Add Donor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default DonorTable;
