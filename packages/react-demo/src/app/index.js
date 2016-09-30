const path = require('path');
const React = require('react');

const Header = require('./header');
const Container = require('./container');
const CompatComponent = require('compat-react-component');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 10
    };
    const urlColor = path.basename(props.path);
    if (urlColor) {
      this.state.color = urlColor;
    }
  }
  logRules() {
    console.log(document.querySelector('style').sheet.cssRules);
  }
  render() {
    return (
      <Container {...this.state}>
        <Header/>
        <div>
          <label>color</label>
          <input
            type="text"
            value={this.state.color}
            onChange={e => this.setState({color: e.target.value})}
          />
          <label>size</label>
          <input
            type="number"
            value={this.state.size}
            onChange={e => this.setState({size: Number(e.target.value)})}
          />
        </div>
        <button onClick={this.logRules}>log sheet rules</button>
        <h4>Compat Component</h4>
        <CompatComponent/>
      </Container>
    );
  }
}

module.exports = App;
