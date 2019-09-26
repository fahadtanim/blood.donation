import M from "materialize-css";
import React, { Component } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ls from "local-storage";

class AppliedUser extends Component {
  state = {};
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("applied user component mounted");
    axios
      .get(
        "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/exhort/get/all/unapproved/users"
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
                    "http://139.59.91.220:8080/bloodbank/api/bloodBank/v1/exhort/approve/" +
                      data.user_id
                  )
                  .then(result => {
                    console.log(result);
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

  render() {
    return (
      <React.Fragment>
        <div className="row header-bar"></div>
        <div className="row">
          <div id="test"></div>
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
      </React.Fragment>
    );
  }
}

export default AppliedUser;
