import React from 'react';
import './App.css';
import Clock from 'react-live-clock';
import { Container, Row, Col } from 'reactstrap';
import Fajr  from "./images/Fajr.svg";
import Dhuhr  from "./images/Dhuhr.svg";
import Asr  from "./images/Asr.svg";
import Maghrib  from "./images/Maghrib.svg";
import Isha  from "./images/Isha.svg";
import azan from "./sound/azan.mp3";
import _ from "lodash";

const sound = new Audio(azan)
const prayers = {
  Fajr: {label:"Fajr", time:"", color:"#753a16", icon : Fajr, urduName:"فجر"},
  Dhuhr: {label:"Dhuhr", time:"", color:"#8dc1e8",icon: Dhuhr, urduName:"ظهر"},
  Asr: {label:"Asr", time:"",color:"#0097da", icon: Asr, urduName:"عصر"},
  Maghrib: {label:"Maghrib", time:"",color:"#d3503b",icon:Maghrib, urduName:"مغرب"},
  Isha: {label:"Isha", time:"",color:"#293a69",icon: Isha, urduName:"عشاء"},
}


const url = "https://api.pray.zone/v2/times/today.json?city=delhi"


class  App extends React.Component{
  state = {prayers}


  componentDidMount(){
    //sound.play();
    this.getPrayerTime();
  }

  getPrayerTime(){
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        response.json().then(data => {
          this.updatePrayerData(data)
        });
      }
    })
    .catch(err => {
      console.log(err);
      throw Error(err);
    });
  }


  updatePrayerData(data){
    const times = _.get(data,"results.datetime[0].times",null)
    if(times){
      _.map(Object.keys(times),item=>{
        if(prayers[item]){
          prayers[item].time = times[item]
        }
      })
    }
    this.setState({prayers})
  }
  
  render(){ 

    return (
      <div className="App">
        <div className="header">
          <div className="date">  
            <Clock  
              date={Date.now()} 
              format={'ddd YYYY MM'}
            /><br/>
          </div>      
          <Clock 
            format={'h:mm:ss A'}
            ticking={true} 
            timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
          />
        </div>

        <Container className="prayers-list">
          {_.map(this.state.prayers,item=>{
            return <Card 
              key={item.label} 
              name={item.label} 
              icon={item.icon} 
              color={item.color} 
              urduName={item.urduName} 
              time={item.time}
            />
          })}
        </Container>
      </div>
    );
  }
}


const Card = props => {
  return <Row className={`prayer-card-item ${props.name} `} >
      <Col className="name">
        <img src={props.icon} className="icon" style={{color:props.color}}/> 
        {props.name}
      </Col>

      <Col className="time">{props.time}</Col>
      
      <Col className="urdu">{props.urduName}</Col>
  </Row>
}


export default App;
