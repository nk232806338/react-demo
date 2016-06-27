var React = require('react');
var Calendar = require('../calendar/calendar_base');
var classNames = require('classnames');
require('./dialog.scss');
var Dialog = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func
  },
  getInitialState() {
    return {
      show: true
    }
  },

  handleClose() {
    var { onClose } = this.props;
    if (onClose) {
      onClose()
    };
  },
  render() {
    return (<div  className="dialog-wrapper">
      <div className="over-layer"></div>
      <div className="dialog-mod">
        <div className="close" onClick={this.handleClose}>X</div>
        {this.props.children}
        <div className="icon icon-1"></div>
        <div className="icon icon-2"></div>
      </div>
    </div>);  
  },
});

module.exports = Dialog;

