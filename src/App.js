import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "materialize-css";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Components/home/home";
import DonorList from "./Components/donorList/donorList";
import DonorTable from "./Components/donorTable/donorTable";
import AppliedUser from "./Components/appliedUser/appliedUser";
import Footer from "./Components/footer/footer";
import Header from "./Components/header/header";
function App() {
  return (
    <BrowserRouter>
      {/* <Header></Header> */}
      <Route exact path="/(home|)" component={Home} />
      {/* <Route exact path="/home" component={Home} /> */}
      <Route exact path="/donorlist" component={DonorList} />
      <Route exact path="/donortable" component={DonorTable} />
      <Route exact path="/applieduser" component={AppliedUser} />
      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
