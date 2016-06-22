var React = require('react');

var Menu = React.createClass({
  displayName: 'Menu',
  render() {
    return (<div className="menu-layout">
      <div className="menu-title">
        <h6>交易管理</h6>
        <ul>
          <li>订单管理</li>
          <li>退款中心</li>
          <li>评价管理</li>
        </ul>
      </div>
      <div className="menu-title">
        <h6>商品管理</h6>
        <ul>
          <li>发布管理</li>
          <li>出售中的商品</li>
          <li>类目管理</li>
          <li>商品分类</li>
        </ul>
      </div>
      <div className="menu-title">
        <h6>店铺管理</h6>
        <ul>
          <li>店铺查看</li>
          <li>店铺装修</li>
          <li>店铺信息</li>
        </ul>
      </div>
      <div className="menu-title">
        <h6>营销管理</h6>
        <ul>
          <li>店铺红包</li>
          <li>包邮</li>
        </ul>
      </div>
    </div>);
  }
});

module.exports = Menu;