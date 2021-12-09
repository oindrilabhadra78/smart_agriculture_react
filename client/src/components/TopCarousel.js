import React from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

const TopCarousel = () => {
  return (
    <div>
      <Carousel>
        <Carousel.Item interval={1000}>
          <img
            width="100%"
            height="100%"
            src={require("./img/landing.jpg")}
            alt="First slide"
          />
          <Carousel.Caption>
            <h1 style={{marginBottom:"30px", fontSize:'150px', fontFamily:'Arial',fontWeight:'Bold'}}>Farmicy</h1>
            <h4 style={{fontWeight:'Bold'}}>A decentralised app for farmers to avail government policies and cold storage resources</h4>
            <div style={{ paddingBottom: '30%'}}></div>
          </Carousel.Caption>

        </Carousel.Item>

        <Carousel.Item interval={500}>
          <img
            width="100%"
            height="100%"
            src={require("./img/farmer.jpg")}
            alt="Second slide"
          />
          <Carousel.Caption>
          <h1 style={{marginBottom:"30px", color:'black', fontSize:'70px', fontFamily:'Arial',fontWeight:'Bold'}}>For Farmers</h1>
            <h5 style={{color:'black',fontWeight:'Bold'}}>Avail goverment policies and cold storage facilities with ease.</h5>
            <Link to="/FarmerPage" className="btn btn-primary">
              Register as Farmer
            </Link>
            <div style={{ paddingBottom: '35%' }}></div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={500}>
          <img
            width="100%"
            height="100%"
            src={require("./img/official.jpg")}
            alt="Second slide"
          />
          <Carousel.Caption>
          <h1 style={{marginBottom:"30px", fontSize:'70px', fontFamily:'Arial',fontWeight:'Bold'}}>For Government Officials</h1>
            <h5 style ={{fontWeight:'Bold'}}>Verify farmer details, manage policies and cold storage</h5>
            <Link to="/OfficialPage" className="btn btn-primary" style={{marginTop: "30px"}}>
              Register as official
            </Link>
            <div style={{ paddingBottom: '30%' }}></div>
          </Carousel.Caption>
        </Carousel.Item>

      </Carousel>
    </div>
  );

};

export default TopCarousel;
