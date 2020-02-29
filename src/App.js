import React from 'react';
import './App.css';
import Home from './components/Home'
import Player from './components/Player'
import SongList from './components/SongList'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/player/:id" component={Player}/>
          <Route path="/songList/:id" component={SongList} />
          <Route path="/" component={Home}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
