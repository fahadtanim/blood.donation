import { Bar } from 'react-chartjs-2';
import M from "materialize-css";
import React, { Component } from "react";
import {NavLink} from "react-router-dom";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import ls from 'local-storage'
import "./donorList.css";
class DonorList extends Component {
    state = {
        data : {
            labels: ['A(+)ve', 'A(-)ve', 'B(+)ve', 'B(-)ve', 'O(+)ve', 'O(-)ve', 'AB(+)ve',"AB(-)ve"],
            datasets: [
              {
                label: 'Donation Amount',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 56, 55, 40,60,0]
              }
            ]
          }
    };
    componentDidMount() {
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

    render(){
        return(
            <React.Fragment>
                <div className="row header-bar"></div>
                <div className = "container">
                
                    <div className = "row">
                        <div className = "menu-container">
                            <button className="waves-effect waves-light btn">Leader</button>
                            <button className="waves-effect waves-light btn">Tester</button>
                            <NavLink to ="/donortable" className="waves-effect waves-light btn">Donor</NavLink>>
                            <button className="waves-effect waves-light btn">Admin</button>
                            
                        </div>
                    </div>
                    <div className = "row">
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