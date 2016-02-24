'use strict';

var Viewer = React.createClass({
  displayName: 'Viewer',

  getInitialState: function getInitialState() {
    return {
      curr: 0,
      total: 0,
      index: {},
      updated: 0,
      viewer: undefined
    };
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { id: 'nav' },
        React.createElement(
          'span',
          { className: 'nav', id: 'navleft', onClick: this.navLeft },
          '←'
        ),
        ' |',
        React.createElement(
          'span',
          { className: 'nav', id: 'navright', onClick: this.navRight },
          '→'
        )
      )
    );
  },

  getIndex: function getIndex() {
    var _this = this;

    Get('models/index.json', function (d) {
      var total = d.files.length;
      var updated = d.updated;
      var newState = React.addons.update(_this.state, {
        index: { $set: d },
        curr: { $set: total - 1 },
        total: { $set: total },
        updated: { $set: updated }
      });
      _this.setState(newState);

      var diff = (new Date().getTime() / 1000.0 - updated) / 60.0;

      var tmsg = '(inactive)';
      if (diff < 20.0) {
        tmsg = '(' + diff.toFixed(1) + 'mins since last update)';
      }

      var msg = total + '/' + total + ' ' + tmsg;
      _this.props.message(msg);

      var viewer = _this.state.viewer;
      ViewerUtils.loadObj('models/' + d.recent, viewer);
    });
  },

  navLeft: function navLeft() {
    this.nav(-1);
  },

  navRight: function navRight() {
    this.nav(1);
  },

  nav: function nav(d) {
    var curr = this.state.curr;
    var total = this.state.total;
    var viewer = this.state.viewer;
    var index = this.state.index;

    var newCurr = (curr + d) % total;
    if (newCurr < 0) {
      newCurr = total - 1;
    }

    var newState = React.addons.update(this.state, {
      curr: { $set: newCurr }
    });
    this.setState(newState);

    ViewerUtils.loadObj('models/' + index.files[newCurr], viewer);

    var msg = newCurr + 1 + '/' + total;
    this.props.message(msg);
  },

  doAnimate: function doAnimate() {
    var viewer = this.state.viewer;
    if (this.state.viewer) {
      viewer.controls.update();
      viewer.renderer.render(viewer.scene, viewer.camera);
    }
    window.requestAnimationFrame(this.doAnimate);
  },

  componentDidMount: function componentDidMount() {

    var viewer = ViewerUtils.makeViewer();
    ReactDOM.findDOMNode(this).appendChild(viewer.renderer.domElement);

    var newState = React.addons.update(this.state, {
      viewer: { $set: viewer }
    });
    this.setState(newState);
    this.getIndex();

    key('right', this.navRight);
    key('left', this.navLeft);

    this.doAnimate();
  }
});

var App = React.createClass({
  displayName: 'App',


  getInitialState: function getInitialState() {
    return {
      message: 'no model loaded'
    };
  },

  componentDidMount: function componentDidMount() {},
  componentWillUnmount: function componentWillUnmount() {},

  setMessage: function setMessage(a) {
    var newState = React.addons.update(this.state, {
      message: { $set: a }
    });
    this.setState(newState);
  },

  render: function render() {
    console.log('App render');
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { id: 'head' },
        'live gen beta | ',
        React.createElement(
          'a',
          { href: 'http://inconvergent.net/' },
          'inconvergent.net'
        )
      ),
      React.createElement(
        'div',
        { id: 'message' },
        this.state.message
      ),
      React.createElement(Viewer, { message: this.setMessage })
    );
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('container'));