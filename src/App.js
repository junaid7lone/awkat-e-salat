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


const prayers = {
  Fajr: {label:"Fajr", time:"", color:"#753a16", icon : Fajr, urduName:"فجر"},
  Dhuhr: {label:"Dhuhr", time:"", color:"#8dc1e8",icon: Dhuhr, urduName:"ظهر"},
  Asr: {label:"Asr", time:"",color:"#0097da", icon: Asr, urduName:"عصر"},
  Maghrib: {label:"Maghrib", time:"",color:"#d3503b",icon:Maghrib, urduName:"مغرب"},
  Isha: {label:"Isha", time:"",color:"#293a69",icon: Isha, urduName:"عشاء"},
}


const url = "https://api.pray.zone/v2/times/today.json?city=karachi"


class  App extends React.Component{
  state = {prayers}

  componentDidMount(){
    this.keepDisplayOn();
    this.getPrayerTime();
  }
  
  playSound(){
    const sound = new Audio(azan)
    sound.play();
  }

  get allTimes(){
    const times = _.map(this.state.prayers, function(prayer){return prayer.time});
    return times; 
  }

  initiateAlarmChecker(){
    const everyMinute = 1000*60;
    const allTimes = this.allTimes;
    
    setInterval(()=>{
      const currentTime = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
      if(_.includes(allTimes, currentTime)){
        this.playSound()
      }                                      
    }, everyMinute)

  }

  keepDisplayOn(){
    var Util={};
    Util.base64 = function(mimeType, base64) {
      return 'data:' + mimeType + ';base64,' + base64;
    };

    var video = document.createElement('video');
      video.setAttribute('loop', '');

      function addSourceToVideo(element, type, dataURI) {
        var source = document.createElement('source');
        source.src = dataURI;
        source.type = 'video/' + type;
        element.appendChild(source);
      }

      addSourceToVideo(video,'webm', Util.base64('video/webm', 'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='));
      addSourceToVideo(video, 'mp4', Util.base64('video/mp4', 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=='));

    video.play();
  }

  getPrayerTime(){
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        response.json().then(data => {
          this.updatePrayerData(data)
          this.initiateAlarmChecker();
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
