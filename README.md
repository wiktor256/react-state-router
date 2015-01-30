
# React State Router

Flexible router for ReactJS applications.

## Overview

The goal of the React State Router is to simplify routing in ReactJS applications.
The main premise of the React State Router is that it is uses serialized router state as a route.
Because this approach doesn't rely on predefined list of routes, it allows great flexibility in view composition.

## Installation

You can install the React State Router as a npm package

    npm install react-state-router


## Sample Usage

Views that need to get or set a router state should use StateRouterMixin.

PageSidebar.jsx

```javascript
var React = require('react');
var StateRouterMixin = require('react-state-router/StateRouterMixin');

var PageSidebar = React.createClass({
  mixins: [StateRouterMixin],
  getInitialState: function() {
    return {
      menu: ['mailbox', 'contacts']
    };
  },
  handleMenuItem: function(menuItem) {
    this.setRouterState({
      page: menuItem
    });
  },
  render: function() {
    var _this = this;
    var page = this.getRouterState().page;
    var menuItems = this.state.menu.map(function(menuItem) {
      return (
        <li key={menuItem} className={ page === menuItem ? 'active' : undefined }>
          <a onClick={ function() { _this.handleMenuItem(menuItem); } }>
            { menuItem }
          </a>
        </li>
      );
    });
    return (
      <ul>
        {menuItems}
      </ul>
    );
  }
});

module.exports = PageSidebar;
```

PageContent.jsx

```javascript
var React = require('react');
var MailBoxPage = require('./MailBoxPage.jsx');
var ContactsPage = require('./ContactsPage.jsx');
var StateRouterMixin = require('react-state-router/StateRouterMixin');

var PageContent = React.createClass({
  mixins: [StateRouterMixin],
  render: function() {
    var page = this.getRouterState().page;
    if (page === 'mailbox') {
      return <MailBoxPage/>;
    }
    else if (page === 'contacts') {
      return <ContactsPage/>;
    }
  }
});

module.exports = PageContent;
```

Application needs to initialize StateRouter.

App.jsx

```javascript
var React = require('react');
var StateRouter = require('react-state-router');
var PageSidebar = require('./PageSidebar.jsx');
var PageContent = require('./PageContent.jsx');

var App = React.createClass({
  componentDidMount: function() {
    StateRouter.init({
      rootComponent: this
    });
  },
  render: function() {
    return (
      <div>
        <PageSidebar/>
        <PageContent/>
      </div>
    );
  }
});

module.exports = App;
```

## Child Router States

There are scenarios when a view needs to maintain its own router state without affecting parent view router state.

For example, an application will set 'contacts' as the currently selected page in the router state.

```javascript
router state => { page: 'contacts' }
```

Then the 'contacts' page would want to set 'abcd' as the contactID of the currently selected contact.
Since the 'contacts' page is not aware of the parent router state, it would overwrite parent state and effectively remove 'page' from the router state.


```javascript
router state => { contactID: 'abcd' }
```

To prevent this behavior, views that maintain their own state need to be placed inside StateRouterView.

PageContent.jsx

```javascript
var React = require('react');
var MailBoxPage = require('./MailBoxPage.jsx');
var ContactsPage = require('./ContactsPage.jsx');
var StateRouterView = require('react-state-router/StateRouterView.jsx');
var StateRouterMixin = require('react-state-router/StateRouterMixin');

var PageContent = React.createClass({
  mixins: [StateRouterMixin],
  render: function() {
    var page = this.getRouterState().page;
    return (
      <StateRouterView routerContext={page}>
        { this.renderPage(page) }
      </StateRouterView>
    );
  },
  renderPage: function(page) {
    if (page === 'mailbox') {
      return <MailBoxPage/>;
    }
    else if (page === 'contacts') {
      return <ContactsPage/>;
    }
  }
});

module.exports = PageContent;
```
Now, when the 'contacts' page sets contactID in the router state, it will do so inside a child router context.


```javascript
router state => {
  page: 'contacts',
  contacts: {         // this is a child router context
    contactID: 'abcd'
  }
}
```
And when a user clicks on menu to see the mailbox page, the entire state will be overwritten like this:

```javascript
router state => { page: 'mailbox' }
```














