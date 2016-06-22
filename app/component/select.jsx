var React = require('react');
var _ = require('underscore');
require('./select.scss');
var Select = React.createClass({
  displayName: 'select',
  propTypes: {
    title: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    data: React.PropTypes.any,
  },
  getInitialState() {
    return {
      data: this.props.data,
      keyWord: 'aaa',
    }
  },
  componentWillUpdate(nextProps) {
    if (this.state.data != nextProps.data) {
      this.setState({
        data: nextProps.data
      });
    }
  },
  handleClick(event, itemId) {
    this.props.onSelect(itemId);
    var data = this.state.data;
    _.each(data, (item) => {
      item.active = false;
    });
    var willActiveItem = _.find(data, item => item.id == itemId);
    willActiveItem.active = true;
    this.setState({
      data
    });
  },
  handleInput(event) {
    this.setState({
      keyWord: event.target.value
    });
  },
  render() {
    var {data, title} = this.props;
    return (<div className="mod-select">
      <h6>{title}</h6>
      <span>span:{this.state.keyWord}</span>
      <input type="text" value={this.state.keyWord} onChange={this.handleInput}/>
      <ul>
        {data.map((item)=> {
          return <li
            key={item.id} className={item.active ? 'active' : null}
            onClick={(event) => {this.handleClick(event, item.id)}}>
            {item.name}
          </li>
        })}
      </ul>
    </div>);
  },
});

module.exports = Select;