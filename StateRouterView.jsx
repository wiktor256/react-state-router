

var React = require('react/addons');

var StateRouterView = React.createClass({

  propTypes: {
    routerContext: React.PropTypes.string
  },

  contextTypes: {
    routerContext: React.PropTypes.string
  },

  childContextTypes: {
    routerContext: React.PropTypes.string
  },

  getChildContext: function() {
    var routerContext = this.context.routerContext;

    if (this.props.routerContext) {
      routerContext = (routerContext ? routerContext + '.' : '') + this.props.routerContext;
    }

    return {
      routerContext: routerContext
    };
  },

  render: function() {

    // cloning children to take ownership of them. This allows children to receive context from this component.
    var clonedChildren = React.Children.map(this.props.children, function(childComponent) {
      return childComponent ?
        React.addons.cloneWithProps(childComponent, {
          key: (childComponent.key ? childComponent.key : undefined)
        }) : undefined;
    });

    return (
      <div {...this.props}>
          {clonedChildren}
      </div>
    );
  }
});

module.exports = StateRouterView;
