var React = require('react/addons');
var StateRouter = require('./StateRouter');

var StateRouterMixin = {

  contextTypes: {
    routerContext: React.PropTypes.string
  },

  setRouterState: function(state) {
    StateRouter.setState(state, this.context.routerContext);
  },

  getRouterState: function() {
    return StateRouter.getState(this.context.routerContext);
  }
};

module.exports = StateRouterMixin;