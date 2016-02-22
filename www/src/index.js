'use strict';

/* jshint ignore:start */

var Viewer = React.createClass({
  displayName: 'Viewer',

  getInitialState: function getInitialState() {
    return {
      curr: 0,
      total: 0,
      index: {},
      viewer: undefined
    };
  },

  render: function render() {
    return React.createElement('div', null);
  },

  getIndex: function getIndex() {
    var _this = this;

    Get('models/index.json', function (d) {
      var total = d.files.length;
      var newState = React.addons.update(_this.state, {
        index: { $set: d },
        curr: { $set: total - 1 },
        total: { $set: total }
      });
      _this.setState(newState);

      var msg = total + '/' + total;
      _this.props.message(msg);

      var viewer = _this.state.viewer;
      ViewerUtils.loadObj('models/' + d.recent, viewer);
    });
  },

  nav: function nav(d) {
    var curr = this.state.curr;
    var total = this.state.total;
    var viewer = this.state.viewer;
    var index = this.state.index;

    var newCurr = curr + d;
    if (newCurr > -1 && newCurr < total) {
      var newState = React.addons.update(this.state, {
        curr: { $set: newCurr }
      });
      this.setState(newState);

      ViewerUtils.loadObj('models/' + index.files[newCurr], viewer);

      var msg = newCurr + 1 + '/' + total;
      this.props.message(msg);
    } else {
      console.log('could not load model');
      document.body.style.backgroundColor = '#555';
      var task = setTimeout(function () {
        document.body.style.backgroundColor = '#FFF';
      }, 150);
    }
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

    var self = this;
    key('right', function () {
      self.nav(1);
    });
    key('left', function () {
      self.nav(-1);
    });

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

ReactDOM.render(React.createElement(App, { onKeyPress: alert }), document.getElementById('container'));

/* jshint ignore:start */