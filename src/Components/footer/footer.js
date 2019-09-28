import React, { Component } from "react";
import "./footer.css";
export default class Footer extends Component {
  render() {
    return (
      <React.Fragment>
        <footer className="row">
          <div className="col s12">
            <div className="row">
              <div className="container">
                <div className="row">
                  <img
                    src="../../Assets/images/shondhani-logo.svg"
                    className="col s3 m1"
                  />
                  <div className="col m4"></div>
                  <img
                    src="../../Assets/images/dbc-logo.svg"
                    className="col s6 m2"
                  />
                  <div className="col m4"></div>
                  <img
                    src="../../Assets/images/exhort-logo.svg"
                    className="col s3 m1"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col s4 bottom-footer-bar-left"></div>
              <div className="col s4"></div>
              <div className="col s4 bottom-footer-bar-right"></div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}
