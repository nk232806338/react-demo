var React = require('react');
var Select = require('./../../component/select.jsx');
var Dialog = require('../../component/dialog/dialog');
var _ = require('underscore');
require('./work-space.scss');
var data_level_0 = [
  {name: '家用电器', id: 0},
  {name: '养生', id: 1},
  {name: '服饰', id: 2},
  {name: '运动', id: 3},
  {name: '商品', id: 4}
];

var data_level_1 = [
  {name: '冰箱', id: 111, parentId: 0},
  {name: '彩电', id: 112, parentId: 0},
  {name: '洗衣机', id: 113, parentId: 0},
  {name: '保健品', id: 114, parentId: 1},
  {name: '柒牌男装', id: 115, parentId: 2},
  {name: 'nike', id: 116, parentId: 3},
];

var data_level_2 = [
  {name: '海尔冰箱', id: 1111, parentId: 111},
  {name: 'TCL冰箱', id: 1112, parentId: 111},
  {name: '小天鹅冰箱', id: 1113, parentId: 111},
  {name: 'sony彩电', id: 1121, parentId: 112},
  {name: '乐视', id: 1122, parentId: 112},
  {name: '联想', id: 1123, parentId: 112},
];


var UserSelect = React.createClass({
  getInitialState() {
    return {
      loadStatus: 'loading'
    };
  },
  handleSubmit(event) {
    this.props.handleSubmit({
      userName: this.refs.userName.value,
      userAge: this.refs.userAge.value,
    });
    event.preventDefault();
    event.stopPropagation();
    return false;
  },
  componentDidMount() {
    if (this.refs.userName) this.refs.userName.focus();
    window.setTimeout(() => {
      this.setState({
        loadStatus: 'load-success'
      });
    }, 2000);
  },
  render() {
    var { loadStatus } = this.state;
    return (<div>
      {loadStatus === 'loading' ? <div><img src="/imgs/loading.gif"/></div> :
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="" style={{display: 'block'}}>
            user-name:<input type="text" ref="userName"/>
          </label>
          <label htmlFor="">
            user-age:<input type="text" ref="userAge"/>
          </label>
          <input type="submit">提交</input>
        </form>}

    </div>);
  }
});

var WorkSpace = React.createClass({
  displayName: 'app',
  getInitialState() {
    return {
      show: false,
      data_level_0: data_level_0,
      data_level_1: [],
      data_level_2: [],
    }
  },
  componentDidMount() {
    data_level_0[0].active = true;
    this.handleFirstLevelClick(data_level_0[0].id);
  },
  handleFirstLevelClick(id) {
    // debugger;
    this.setState({
      data_level_1: _.filter(data_level_1, item => item.parentId == id),
    });
  },
  handleSecondLevelClick(id) {
    this.setState({
      data_level_2: _.filter(data_level_2, item => item.parentId == id),
    });

  },
  handleThirdLevelClick(id) {

  },
  showDialog() {
    this.setState({
      show: true
    });
  },
  hideDialog() {
    this.setState({
      show: false
    });
  },
  handleSubmit(req) {
    alert(JSON.stringify(req));
    this.setState({
      show: false
    });
  },
  render() {
    var {data_level_0, data_level_1, data_level_2, show} = this.state;
    return (<div className="work-space">
      <a href="javascript:void(0);" onClick={this.showDialog}>show dialog</a>
      {show ? <Dialog onClose={this.hideDialog}>
        <UserSelect handleSubmit={this.handleSubmit}/>
      </Dialog> : null}
      <Select data={data_level_0} title="一级分类" onSelect={this.handleFirstLevelClick}/>
      <Select data={data_level_1} title="二级分类" onSelect={this.handleSecondLevelClick}/>
      <Select data={data_level_2} title="三级分类" onSelect={this.handleThirdLevelClick}/>
    </div>);
  },
});

module.exports = WorkSpace;