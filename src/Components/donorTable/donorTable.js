import { Bar } from "react-chartjs-2";
import M from "materialize-css";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { config } from "../../services/config";
import jwt_decode from "jwt-decode";
import ls from "local-storage";
import "./donorTable.css";
import { exportDefaultSpecifier } from "@babel/types";

class DonorTable extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.handleSearchByBloodGroup = this.handleSearchByBloodGroup.bind(this);
  }
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
    console.log(dc);
    this.setState({ user_id: dc.id }, () => {
      axios
        .get(
          config.apiUrl +
            "/bloodbank/api/bloodBank/v1/doner/all/doners/" +
            this.state.user_id
        )
        .then(result => this.setState({ data: result.data }));
    });
    // console.log(dc);
    if (dc.role[0].roleName == "SUPER_ADMIN") {
      this.setState({ role: "SA" });
    } else {
      this.setState({ role: "OA" });
    }
    axios
      .get(config.apiUrl + "/bloodbank/api/bloodBank/v1/blood/group/all")
      .then(result => {
        console.log(result);
        this.setState({ blood_group: result.data });
      });

    axios
      .get(config.apiUrl + "/bloodbank/api/bloodBank/v1/community/all")
      .then(result => {
        console.log("community group : ");
        console.log(result);
        this.setState({ community_group: result.data });
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
      instances.forEach(data => data.close());
      elems = document.querySelectorAll("select");
      instances = M.FormSelect.init(elems, {});
    });

    // document
    //   .getElementById("addNewBloodGroupForm")
    //   .addEventListener("submit", e => {
    //     e.preventDefault();
    //   });
    axios
      .get(config.apiUrl + "/bloodbank/api/bloodBank/v1/blood/element/all")
      .then(result => {
        console.log("blood element");
        console.log(result);
        this.setState({ blood_elements: result.data });
      });
    document.addEventListener("click", () => {
      if (document.getElementById("right-btn-container") !== null) {
        document.getElementById("right-btn-container").style.display = "none";
      }
    });
    // let elems = document.querySelectorAll(".datepicker");
    // let instances = M.Datepicker.init(elems, {});
    // let elem = document.getElementById("freezer-donation-date");
    // let dateInstance = M.Datepicker.getInstance(elem);
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
    elems = document.querySelectorAll(".modal");
    // console.log(elems);
    instances = M.Modal.init(elems, {});
    instances.forEach(data => data.close());
    elems = document.querySelectorAll(".dropdown-trigger");
    instances = M.Dropdown.init(elems, {
      closeOnClick: true,
      hover: true,
      autoTrigger: true
    });

    elems = document.querySelectorAll("select");
    instances = M.FormSelect.init(elems, {});
    // axios
    //   .get(
    //     config.apiUrl +
    //       "/bloodbank/api/bloodBank/v1/doner/all/doners/" +
    //       this.state.user_id
    //   )
    //   .then(result => this.setState({ data: result.data }));
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
    let donorList = data.map((data, index) => {
      return (
        <tr
          key={index}
          onContextMenu={e => this.handleRightButtonClick(e, data)}
        >
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
          <td>{data.donation_date ? data.donation_date : "----------"}</td>
        </tr>
      );
    });
    return <tbody id="data-input-field">{donorList}</tbody>;
  };

  handleRightButtonClick = (event, param) => {
    event.preventDefault();
    console.log(param);
    let elem = document.getElementById("right-btn-container");
    this.setState({
      // donor: param,
      donor_id: param.doner_id,
      donor_name: param.doner_name,
      donor_first_address: param.first_address,
      donor_middle_address: param.middle_address,
      donor_last_address: param.last_address,
      donor_email: param.email,
      donor_mobile_number: param.mobile_number,
      donor_blood_group: param.blood_group,
      donor_prev_donation_count: param.number_of_previous_donation
    });
    elem.style.top = this.mouseY(event) + "px";
    elem.style.left = this.mouseX(event) + "px";
    elem.style.display = "block";
    console.log(param);
  };
  handleSearchByBloodGroup = () => {
    // console.log(param);
    let elem = document.getElementById("filter-donor-blood-group");
    console.log(elem);
    if (elem === null || elem === undefined) {
      return;
    }
    let value = elem.value;
    console.log("value : " + value);
    if (value === null || value === undefined) {
      return;
    }
    if (value == 0) {
      axios
        .get(
          config.apiUrl +
            "/bloodbank/api/bloodBank/v1/doner/all/doners/" +
            this.state.user_id
        )
        .then(result => this.setState({ data: result.data }));
    } else {
      axios
        .get(
          config.apiUrl +
            "/bloodbank/api/bloodBank/v1/doner/by/group/" +
            this.state.user_id +
            "/" +
            value
        )
        .then(result => this.setState({ data: result.data }));
    }
  };

  handleToggleNumOfDonation = () => {
    // alert("hjkhj");
    let numOfElem = document.getElementById(
      "new-donor-num-of-previous-donation"
    );
    if (numOfElem === undefined || numOfElem === null) {
      return;
    }
    let elem = document.getElementById("onPrevDon1");
    elem.style.display = numOfElem.checked == true ? "block" : "none";

    elem = document.getElementById("onPrevDon2");
    elem.style.display = numOfElem.checked == true ? "block" : "none";
  };

  handleFormSubmit = () => {
    let decode = jwt_decode(this.state.token);
    console.log(decode);
    let screening_state = "";
    let rejectedFor = "";
    if (
      document.getElementById("new-donor-screening-accepted").checked === true
    ) {
      screening_state = "Accepted";
      rejectedFor = "";
    } else if (
      document.getElementById("new-donor-screening-rejected").checked === true
    ) {
      screening_state = "Rejected";
      let rejElem = document.getElementsByClassName("rejected-for-chk");
      for (let i = 0; i < rejElem.length; i++) {
        if (rejElem[i].checked) {
          if (rejectedFor.length == 0) {
            rejectedFor += rejElem[i].value;
          } else {
            rejectedFor += "," + rejElem[i].value;
          }
        }
      }
    } else {
      screening_state = "NotDone";
      rejectedFor = "";
    }
    let donor = {
      doner_name: document.getElementById("new-donor-name").value,
      first_address: document.getElementById("new-donor-first-address").value,
      middle_address: document.getElementById("new-donor-middle-address").value,
      last_address: document.getElementById("new-donor-last-address").value,
      mobile_number: document.getElementById("new-donor-mobile-number").value,
      email: document.getElementById("new-donor-email").value,
      comunity_group: document.getElementById("new-donor-community-group")
        .value,
      dob: document.getElementById("new-donor-birth-date").value,
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
      donation_date: document.getElementById("new-donor-no-previous-donation")
        .checked
        ? ""
        : document.getElementById("new-donor-last-previous-donation").value,
      user_id: decode.id,
      screening_result: screening_state,
      screening_value: rejectedFor
    };
    console.log("from form");
    console.log(donor);
    // let test = {
    //   doner_name: "first",
    //   first_address: "first",
    //   middle_address: "middle",
    //   last_address: "last",
    //   mobile_number: "01687997516",
    //   email: "test@gmail.com",
    //   comunity_group: "du",
    //   blood_group: "A+",
    //   previous_donation: false,
    //   number_of_previous_donation: "2",
    //   donation_date: "18-09-2019",
    //   dob: "18-09-2019",
    //   screening_result: "Accepted",
    //   screening_value: "",
    //   user_id: 1
    // };
    // console.log(test);
    axios
      .post(config.apiUrl + "/bloodbank/api/bloodBank/v1/doner/add", donor)
      .then(result => {
        if (result.data.status == "OK") {
          M.toast({ html: "Donor Added Successfully" });
          axios
            .get(
              config.apiUrl +
                "/bloodbank/api/bloodBank/v1/doner/all/doners/" +
                this.state.user_id
            )
            .then(result => this.setState({ data: result.data }));
        }
      });

    // axios
    //   .get(config.apiUrl + "/bloodbank/api/bloodBank/v1/doner/all/doners")
    //   .then(result => this.setState({ data: result.data }));
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
    var bloodGroupList = data.map((data, index) => {
      return (
        <button
          className="waves-effect waves-light btn"
          key={data.id}
          onClick={() => {
            this.handleSearchByBloodGroup(data.blood_group);
          }}
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

  handleBloodElementOption = param => {
    if (param === null || param === undefined || param === "") {
      return;
    }
    let data = param.data;
    console.log(data);
    if (data.length == 0) {
      return;
    }
    var bloodElementList = data.map(function(data, index) {
      return (
        <option key={index} value={data.element_name}>
          {data.element_name}
        </option>
      );
    });
    return <React.Fragment>{bloodElementList}</React.Fragment>;
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
    var bloodGroupList = data.map((data, index) => {
      return (
        <option key={index} value={data.blood_group}>
          {data.blood_group}
        </option>
      );
    });

    console.log(param);
    return <React.Fragment>{bloodGroupList}</React.Fragment>;
  };

  handleScreeningToggle = () => {
    let elem = document.getElementById("new-donor-screening-rejected");
    if (elem === null || elem === undefined) {
      return;
    }

    let elemRej = document.getElementById("new-donor-screening-rejected-for");
    if (elem === null || elem === undefined) {
      return;
    }

    elemRej.style.display = elem.checked === true ? "block" : "none";
  };

  handleCommunityGroupOption = param => {
    console.log(this.state);
    if (param === null || param === undefined || param === "") {
      return;
    }
    let data = param.data;
    console.log("in handle CommunityGroup");
    console.log(data);
    if (data.length == 0) {
      return;
    }
    var communityGroupList = data.map((data, index) => {
      return (
        <option key={index} value={data.community_name}>
          {data.community_name}
        </option>
      );
    });

    console.log(param);
    return <React.Fragment>{communityGroupList}</React.Fragment>;
  };

  mouseY = evt => {
    if (evt.pageY) {
      return evt.pageY;
    } else if (evt.clientY) {
      return (
        evt.clientY +
        (document.documentElement.scrollTop
          ? document.documentElement.scrollTop
          : document.body.scrollTop)
      );
    } else {
      return null;
    }
  };

  mouseX = evt => {
    if (evt.pageX) {
      return evt.pageX;
    } else if (evt.clientX) {
      return (
        evt.clientX +
        (document.documentElement.scrollLeft
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft)
      );
    } else {
      return null;
    }
  };

  handleToggleRecieverContact = () => {
    let ownInfoElem = document.getElementById("reciever-own-contact");
    let recieverRelativeInfoElem = document.getElementById(
      "reciever-relative-contact-number"
    );
    let recieverRelativeRelElem = document.getElementById(
      "reciever-relative-contact-relation"
    );

    let queElem = document.getElementById("reciever-can-provide");
    ownInfoElem.style.display = queElem.checked === true ? "block" : "none";
    recieverRelativeInfoElem.style.display =
      queElem.checked === true ? "none" : "block";
    recieverRelativeRelElem.style.display =
      queElem.checked === true ? "none" : "block";
  };

  handleRecieverForm = () => {
    let decode = jwt_decode(this.state.token);
    let reciever = {
      bloodGroup: document.getElementById("reciever-taken-blood-group").value,
      bloodProduct: document.getElementById("reciever-blood-element").value,
      mobileNumber:
        document.getElementById("reciever-can-provide").checked === true
          ? document.getElementById("reciever-mobile-number").value
          : "",
      takingMobileNumber:
        document.getElementById("reciever-can-provide").checked === true
          ? ""
          : document.getElementById("reciever-relative-mobile-number").value,
      relation:
        document.getElementById("reciever-can-provide").checked === true
          ? ""
          : document.getElementById("reciever-relative-relation").value,
      email: document.getElementById("reciever-email").value,
      bloodReason: document.getElementById("reciever-reason").value,
      hospital: document.getElementById("reciever-place-name").value,
      labRef: document.getElementById("reciever-lab-ref-no").value,
      numberOdBag: document.getElementById("reciever-bag-no").value,
      userId: decode.id,
      donerId: document.getElementById("donerId").value
    };

    console.log("from reciever form :");
    console.log(reciever);
    axios
      .post(
        config.apiUrl + "/bloodbank/api/bloodBank/v1/receiver/add",
        reciever
      )
      .then(result => {
        console.log(result);
        if (result.data.status === "OK") {
          M.toast({ html: "Reciever Added Succesfully" });
        } else {
          M.toast({ html: "Couldn't Add Reciever" });
        }
      });
  };

  handleFreezerForm = () => {
    let screening_state = "";
    if (document.getElementById("freezer-screening-accepted").checked) {
      screening_state = "1";
    }
    if (document.getElementById("freezer-screening-rejected").checked) {
      screening_state = "2";
    }
    let freezer = {
      donationDate: document.getElementById("freezer-donation-date").value,
      bloodGroup: document.getElementById("freezer-donor-blood-group").value,
      bloodElement: document.getElementById("freezer-donor-blood-element")
        .value,
      expDate: document.getElementById("freezer-expire-date").value,
      numberOfBag: document.getElementById("freezer-bag-no").value,
      labRef: document.getElementById("freezer-lab-ref-no").value,
      donerName: document.getElementById("freezer-donor-name").value,
      donerEmail: document.getElementById("freezer-donor-email").value,
      donerMobile: document.getElementById("freezer-donor-mobile-number").value,
      bloodpressureLeft: document.getElementById(
        "freezer-donor-blood-pressure-upper"
      ).value,
      bloodpressureRight: document.getElementById(
        "freezer-donor-blood-pressure-lower"
      ).value,
      weight: document.getElementById("freezer-donor-weight").value,
      numberOfDonation: this.state.donor_prev_donation_count + 1,
      screeningValue: screening_state,
      userId: this.state.user_id,
      donerId: this.state.donor_id
    };
    console.log("freezer");
    console.log(freezer);

    axios
      .post(config.apiUrl + "/bloodbank/api/bloodBank/v1/freezer/add", freezer)
      .then(result => {
        if (result.data.status === "OK") {
          M.toast({ html: "Added to Freezer" });
        } else {
        }
      });
  };

  handleTodayDate = () => {
    if (document.getElementById("freezer-donated-today").checked) {
      let date = new Date();
      document.getElementById("freezer-donation-date").value =
        date.getFullYear().toString() +
        "-" +
        (date.getMonth() + 1).toString().padStart(2, 0) +
        "-" +
        date
          .getDate()
          .toString()
          .padStart(2, 0);
      document.getElementById("freezer-donation-date").disabled = true;
    } else {
      document.getElementById("freezer-donation-date").value = "";
      document.getElementById("freezer-donation-date").disabled = false;
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="row header-bar">{this.handleNav(this.state)}</div>
        <div className="container pad-bottom-container">
          <div className="row">
            {/* {this.handleBloodGroupList(this.state.blood_group)} */}
            <div className="col s3">
              <label htmlFor="blood-group">Blood Group:</label>
              <select
                name="blood-group"
                id="filter-donor-blood-group"
                defaultValue="0"
              >
                <option value="0">All</option>
                {this.handleBloodGroupOption(this.state.blood_group)}
              </select>
              <button
                className="wave-effect wave-teal btn"
                onClick={this.handleSearchByBloodGroup}
              >
                Filter
              </button>
            </div>
            <div className="col s6 m6"></div>
            {/* <div className="col s6">
              <div className="row no-bottom-margin">
                <div className="col s6">
                  <label htmlFor="blood-group">Blood Group:</label>
                  <select
                    name="blood-group"
                    id="filter-combo-donor-blood-group"
                    defaultValue="0"
                  >
                    <option value="0">All</option>
                    {this.handleBloodGroupOption(this.state.blood_group)}
                  </select>
                </div>
                <div className="col s6">
                  <label htmlFor="date">Last Donation:</label>
                  <input
                    id="filter-combo-donor-donation-date"
                    type="date"
                    name="ld"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <button
                    className="wave-effect wave-teal btn"
                    onClick={this.handleSearchByBloodGroup}
                  >
                    Filter
                  </button>
                </div>
              </div>
            </div> */}
            <div className="col s3">
              <button
                className="waves-effect waves-light btn modal-trigger add-new-donor-btn"
                data-target="addNewDonarModal"
              >
                Add New Donor
              </button>
            </div>
          </div>
          <div className="row">
            <div id="test"></div>
            <table id="donor-list-table" className="highlight centered col s12">
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
        <div id="right-btn-container" className="collection">
          <a
            className="collection-item modal-trigger"
            data-target="donateToPatientModal"
          >
            Donate to Patient
          </a>
          <a
            className="collection-item modal-trigger"
            data-target="addToFreezerModal"
          >
            Add to Freezer
          </a>
          <a href="#!" className="collection-item">
            Screening
          </a>
        </div>
        {/* ##### DONATE TO PATIENT MODAL ##### */}

        <div id="donateToPatientModal" className="modal">
          <div className="modal-content">
            <div className="container">
              <div className="row">
                <h5 className="subheader col s12">Reciever Information</h5>
                <div className="col s12">
                  <label htmlFor="reciever-taken-bg">Blood Group:</label>
                  <input
                    disabled
                    id="reciever-taken-blood-group"
                    type="text"
                    name="reciever-taken-bg"
                    value={this.state.donor_blood_group}
                  />
                </div>
                <div className="col s12">
                  <label htmlFor="blood-group">Blood Products:</label>
                  <select
                    name="blood-group"
                    id="reciever-blood-element"
                    defaultValue="0"
                  >
                    <option value="0" disabled>
                      ex : Whole Blood
                    </option>
                    {this.handleBloodElementOption(this.state.blood_elements)}
                  </select>
                </div>
                <div className="col s12">
                  <label htmlFor="">Can Patient Provide Own Number:</label>
                  <div className="row">
                    <p className="col s6">
                      <label>
                        <input
                          id="reciever-can-provide"
                          type="radio"
                          name="que"
                          onClick={this.handleToggleRecieverContact}
                          defaultChecked
                        />
                        <span>Yes</span>
                      </label>
                    </p>
                    <p className="col s6">
                      <label>
                        <input
                          id="reciever-cant-provide"
                          type="radio"
                          name="que"
                          onClick={this.handleToggleRecieverContact}
                        />
                        <span>NO</span>
                      </label>
                    </p>
                  </div>
                </div>
                <div className="col s12" id="reciever-own-contact">
                  <label htmlFor="mobile-number">
                    Patient's Mobile Number:
                  </label>
                  <input
                    type="text"
                    name="mobile-number"
                    id="reciever-mobile-number"
                    placeholder="ex : +8801533556677"
                  />
                </div>
                <div
                  className="col s12"
                  id="reciever-relative-contact-number"
                  style={{ display: "none" }}
                >
                  <label htmlFor="mobile-number">
                    Mobile Number of Person Taking Blood:
                  </label>
                  <input
                    type="text"
                    name="mobile-number"
                    id="reciever-relative-mobile-number"
                    placeholder="ex : +8801533556677"
                  />
                </div>
                <div
                  className="col s12"
                  id="reciever-relative-contact-relation"
                  style={{ display: "none" }}
                >
                  <label>Relation with Patient:</label>
                  <input
                    id="reciever-relative-relation"
                    type="text"
                    name="donor_name"
                  />
                </div>
                <div className="col s12">
                  <label htmlFor="">Patient's / Reciever's E-mail:</label>
                  <input
                    id="reciever-email"
                    type="email"
                    name="email"
                    placeholder="example@abc.com"
                  />
                </div>
                <div className="col s12">
                  <label>
                    Indication of blood transfution (For which reason blood
                    needed):
                  </label>
                  <input
                    id="reciever-reason"
                    type="text"
                    name="donor_name"
                    placeholder="e.g: Thalassemia, Caesarean etc"
                  />
                </div>
                <div className="col s12">
                  <label>
                    Where Blood Is Needed / In Which Hospital Patient Is
                    Admitted:
                  </label>
                  <input
                    id="reciever-place-name"
                    type="text"
                    name="reciever-needed-place"
                    placeholder="e.g: Labaid, Apollo etc"
                  />
                </div>
                <div className="col s12">
                  <label>Lab Reference No:</label>
                  <input
                    id="reciever-lab-ref-no"
                    type="text"
                    name="reciever-lab-ref-no"
                  />
                </div>
                <div className="col s12">
                  <label>Bag No:</label>
                  <input
                    id="reciever-bag-no"
                    type="text"
                    name="reciever-bag-no"
                  />
                </div>
                <input
                  type="hidden"
                  id="donerId"
                  name="dontId"
                  value={this.state.donor_id}
                ></input>
                <div className="col s12">
                  <button
                    type="submit"
                    className="btn waves-effect waves-light modal-close"
                    onClick={() => {
                      this.handleRecieverForm();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ##### ADD TO FREEZER MODAL ##### */}
        <div id="addToFreezerModal" className="modal">
          <div className="modal-content">
            <div className="container">
              <div className="row">
                <h5 className="subheader col s12">Add to Freezer</h5>
                <p className="col s12">
                  <label>
                    <input
                      id="freezer-donated-today" /* document.getElementById("freezer-donated-today").value*/
                      type="checkbox"
                      name="freezing-donated-today"
                      onClick={this.handleTodayDate}
                    />
                    <span>Tick If You Have Donated Today</span>
                  </label>
                </p>
                <div className="col s12">
                  <label htmlFor="date">Donation Date:</label>

                  <input
                    id="freezer-donation-date" /* document.getElementById("freezer-donation-date").value*/
                    type="date"
                    name="freezer-donation-date"
                    className="datepicker"
                  />
                </div>
                <div className="col s12">
                  <label htmlFor="freezer-bg">Blood Group:</label>
                  <input /* document.getElementById("freezer-blood_group").value*/
                    disabled
                    id="freezer-donor-blood-group"
                    type="text"
                    name="freezer-bg"
                    value={this.state.donor_blood_group}
                    disabled
                  />
                </div>
                <div className="col s12">
                  <label htmlFor="blood-element">Blood Products:</label>
                  <select
                    name="blood-element"
                    id="freezer-donor-blood-element"
                    defaultValue="0"
                  >
                    <option value="0" disabled>
                      ex : Whole Blood
                    </option>
                    {this.handleBloodElementOption(this.state.blood_elements)}
                  </select>
                </div>
                <div className="col s12">
                  <label htmlFor="date">Expire Date:</label>

                  <input
                    id="freezer-expire-date" /* document.getElementById("freezer-donation-date").value*/
                    type="date"
                    name="freezer-expire-date"
                    className="datepicker"
                  />
                </div>
                <div className="col s12">
                  <label>Bag Number:</label>
                  <input
                    id="freezer-bag-no"
                    type="text"
                    name="freezer-bag-no"
                  />
                </div>
                <div className="col s12">
                  <label>Lab Reference Number:</label>
                  <input
                    id="freezer-lab-ref-no"
                    type="text"
                    name="freezer-lab-ref-no"
                  />
                </div>
                <div className="col s12">
                  <label>Donor's Name:</label>
                  <input
                    id="freezer-donor-name"
                    type="text"
                    name="donor_name"
                    value={this.state.donor_name}
                    disabled
                  />
                </div>
                <div className="col s12">
                  <label>Donor's Address:</label>
                  <div className="row">
                    <div className="col s12 m4">
                      <input
                        id="freezer-donor-first-address"
                        type="text"
                        name="first_address"
                        placeholder="first address"
                        value={this.state.donor_first_address}
                        disabled
                      />
                    </div>
                    <div className="col s12 m4">
                      <input
                        id="freezer-donor-middle-address"
                        type="text"
                        name="middle_address"
                        placeholder="middle address"
                        value={this.state.donor_middle_address}
                        disabled
                      />
                    </div>
                    <div className="col s12 m4">
                      <input
                        id="freezer-donor-last-address"
                        type="text"
                        name="last_address"
                        placeholder="last address"
                        value={this.state.donor_last_address}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="col s12">
                  <label htmlFor="">Donor's E-mail:</label>
                  <input
                    id="freezer-donor-email"
                    type="email"
                    name="email"
                    placeholder="example@abc.com"
                    value={this.state.donor_email}
                    disabled
                  />
                </div>
                <div className="col s12">
                  <label htmlFor="mobile-number">Donor's Mobile Number:</label>
                  <input
                    type="text"
                    name="mobile-number"
                    id="freezer-donor-mobile-number"
                    placeholder="ex : +8801533556677"
                    value={this.state.donor_mobile_number}
                    disabled
                  />
                </div>
                <h6 className="subheader-optional col s12">Optional</h6>
                <div className="col s12 m6">
                  <label>Donor's Blood Pressure:</label>
                  <div className="row">
                    <div className="col s5 m5">
                      <input
                        id="freezer-donor-blood-pressure-upper"
                        type="number"
                        name="first_address"
                        placeholder="upper"
                      />
                    </div>
                    <div
                      className="col"
                      style={{ fontSize: "24px", marginTop: "10px" }}
                    >
                      /
                    </div>
                    <div className="col s5 m5">
                      <input
                        id="freezer-donor-blood-pressure-lower"
                        type="number"
                        name="middle_address"
                        placeholder="lower"
                      />
                    </div>
                  </div>
                </div>
                <div className="col s12 m6">
                  <label>Donor's Weight:</label>
                  <div className="row">
                    <div className="col s9 m6">
                      <input
                        id="freezer-donor-weight"
                        type="number"
                        name="first_address"
                        placeholder="ex. 150Kg"
                      />
                    </div>
                    <div
                      className="col"
                      style={{ fontSize: "20px", marginTop: "14px" }}
                    >
                      Kg
                    </div>
                  </div>
                </div>
                <div className="col s12 m12">
                  <label>Number of Donation Including This Donation</label>
                  <input
                    id="freezer-donor-donation-count"
                    type="number"
                    name="middle_address"
                    placeholder="ex.  3"
                  />
                </div>
                <div className="col s12">
                  <label htmlFor="">
                    Tick If ( No Need if screening is done before donation)
                  </label>
                  <p>
                    <label>
                      <input
                        id="freezer-screening-accepted"
                        type="radio"
                        name="freezing-screening"
                      />
                      <span>Screening Done or Accepted</span>
                    </label>
                  </p>
                  <p>
                    <label>Or</label>
                  </p>
                  <p>
                    <label>
                      <input
                        id="freezer-screening-rejected"
                        type="radio"
                        name="freezing-screening"
                      />
                      <span>Screening Done or Rejected</span>
                    </label>
                  </p>
                </div>
                <input
                  type="hidden"
                  id="donerId"
                  name="dontId"
                  value={this.state.donor_id}
                ></input>
                <div className="col s12">
                  <button
                    type="submit"
                    className="btn waves-effect waves-light modal-close"
                    onClick={() => {
                      this.handleFreezerForm();
                    }}
                  >
                    Add to Freezer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ###### ADD NEW DONOR ####### */}
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
                      <label htmlFor="blood-group">Community:</label>
                      <select
                        name="community-group"
                        id="new-donor-community-group"
                        defaultValue="0"
                      >
                        <option value="0" disabled>
                          ex : DU
                        </option>
                        {this.handleCommunityGroupOption(
                          this.state.community_group
                        )}
                      </select>
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
                      <label htmlFor="blood-group">Blood Group:</label>
                      <select
                        name="blood-group"
                        id="new-donor-blood-group"
                        defaultValue="0"
                      >
                        <option value="0" disabled>
                          ex : A+
                        </option>
                        {this.handleBloodGroupOption(this.state.blood_group)}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12">
                      <label htmlFor="date">Birth Date:</label>
                      <input id="new-donor-birth-date" type="date" name="bd" />
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
                            onClick={this.handleToggleNumOfDonation}
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
                            onClick={this.handleToggleNumOfDonation}
                          />
                          <span>H/O Previous Donation</span>
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
                  {/* Screening RADIO BUTTON */}
                  <div className="row">
                    <div className="col s12">
                      <label htmlFor="">Screening:</label>
                      <p>
                        <label>
                          <input
                            id="new-donor-screening-accepted"
                            type="radio"
                            name="screening"
                            onClick={this.handleScreeningToggle}
                            defaultChecked
                          />
                          <span>Screening Done & Accepted</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input
                            id="new-donor-screening-rejected"
                            type="radio"
                            name="screening"
                            onClick={this.handleScreeningToggle}
                          />
                          <span>Screening Done & Rejected</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input
                            id="new-donor-screening-not-done"
                            type="radio"
                            name="screening"
                            onClick={this.handleScreeningToggle}
                          />
                          <span>Screening Not Done</span>
                        </label>
                      </p>
                    </div>
                  </div>

                  <div
                    className="row"
                    id="new-donor-screening-rejected-for"
                    style={{ display: "none" }}
                  >
                    <div className="col s12">
                      <label htmlFor="">Rejected for:</label>
                      <p>
                        <label>
                          <input
                            type="checkbox"
                            value="HBs Ag Positive"
                            className="filled-in rejected-for-chk"
                          />
                          <span>HBs Ag Positive</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input
                            type="checkbox"
                            value="Anti HCV Positive"
                            className="filled-in rejected-for-chk"
                          />
                          <span>Anti HCV Positive</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input
                            type="checkbox"
                            value="HIV Positive"
                            className="filled-in rejected-for-chk"
                          />
                          <span>HIV Positive</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input
                            type="checkbox"
                            value="VDRL Positive"
                            className="filled-in rejected-for-chk"
                          />
                          <span>VDRL Positive</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input
                            type="checkbox"
                            value="MP Positive"
                            className="filled-in rejected-for-chk"
                          />
                          <span>MP Positive</span>
                        </label>
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12">
                      <button
                        className="btn waves-effect waves-light modal-close"
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
