var React = require('react');
var Calendar = require('../calendar/calendar_base');
require('./dialog.scss');
var Dialog = React.createClass({
  render() {
    return (<div className="dialog-wrapper">
      <div className="over-layer"></div>
      <div className="dialog-mod">
        <Calendar />
        <div className="icon icon-1"></div>
        <div className="icon icon-2"></div>
      </div>
    </div>);  
  },
});

module.exports = Dialog;

