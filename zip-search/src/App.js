import React, { Component } from 'react';
import './App.css';


function City({json}) { 
  let splitCity = json.City.toLowerCase().split(' ');
  for(var i = 0; i < splitCity.length; i ++) {
    splitCity[i] = splitCity[i].charAt(0).toUpperCase() + splitCity[i].substring(1);
  }
  let capitalizeCity = splitCity.join(' ');

  if(!json.EstimatedPopulation)
    json.EstimatedPopulation = 'N/A';

  return (
  <div className="card mt-2 mb-2">
      <div className="card-header">
        <strong> {capitalizeCity} </strong>
      </div>
      <div className="card-body">
        <ul>
          <li> State: {json.State} </li>
          <li> Location: {json.Lat}, {json.Long} </li>
          <li> Estimated Population: {json.EstimatedPopulation} </li>
        </ul>
      </div>
  </div>
  );
}

function ZipSearchField({ onZipChange }) {
  return (
      <div className="mt-2">
        <label className='mr-2'> <strong> Zip Code: </strong> </label>
        <input type="text" onChange={onZipChange}/>
      </div>
  );
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCode: '',
      cities: [],
    }
  }

  zipChanged(e) {
    let zip = e.target.value;

    // Conditional for not found when length is 0 and it is not a number
    if(e.target.value.length !== 5 || isNaN(e.target.value)) {
      this.setState({
        zipCode: '',
        cities: [],
      })
      return
    }

    fetch(`https://ctp-zip-api.herokuapp.com/zip/${zip}`)
      .then(res => res.json())
      .then(jsonData => {
        this.setState({
          cities: jsonData
        })
      })
      .catch(error => {
        console.log("Invalid Zip Code!");
      });

    this.setState({
      zipCode: e.target.value
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Zip Code Search</h2>
        </div>
        <div className="container pt-2">
          <ZipSearchField onZipChange={(e) => this.zipChanged(e)} />
          <div>
            {
              (this.state.cities.length === 0
                ? <div className='mt-2'> No results found for the above zip code. </div>
                : this.state.cities.map(c => {
                    return <City 
                      key={c.RecordNumber} 
                      json={c}
                    />
                  })
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
