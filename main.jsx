var React = require('react');
var ReactDOM = require('react-dom');
var Menu = require('./app/layout/menu/menu.jsx');
var WorkSpace = require('./app/layout/workspace/work-space.jsx');
var Dialog = require('./app/component/dialog/dialog');
const Calendar = require('./app/component/calendar/calendar_base.jsx');
const selectedDates = [
  '2016-04-14', '2016-04-15', '2016-04-16',
];
var App = React.createClass({
  displayName: 'app-1',
  getInitialState() {
    return {
      count: 0
    };
  },
  componentDidMount() {
  },
  handleSubmit() {

  },
  render() {
    return (<div className="app">
      <Dialog />
      <Menu />
      <WorkSpace />
      <Calendar />
    </div>);
  }
});

ReactDOM.render(<App />, document.getElementById('app_container'));