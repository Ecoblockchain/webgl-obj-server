/* jshint ignore:start */

let Viewer = React.createClass({
  getInitialState: () => ({
    curr: 0,
    total: 0,
    index: {},
    viewer: undefined
  }),

  render: function() {
    return <div/>
  },

  getIndex: function(){
    Get('models/index.json', (d) => {
      let total = d.files.length
      let newState = React.addons.update(this.state, {
        index: {$set: d},
        curr: {$set: total-1},
        total: {$set: total}
      });
      this.setState(newState)

      let msg = total + '/' + total
      this.props.message(msg)

      let viewer = this.state.viewer
      ViewerUtils.loadObj('models/'+d.recent, viewer)
    })
  },

  nav: function(d){
    let curr = this.state.curr
    let total = this.state.total
    let viewer = this.state.viewer
    let index = this.state.index

    let newCurr = curr + d
    if (newCurr>-1 && newCurr<total){
      let newState = React.addons.update(this.state, {
        curr: {$set: newCurr},
      });
      this.setState(newState)

      ViewerUtils.loadObj('models/'+index.files[newCurr], viewer)

      let msg = (newCurr+1) + '/' + total
      this.props.message(msg)
    }
    else{
      console.log('could not load model')
      document.body.style.backgroundColor = '#555';
      var task = setTimeout(function() {
        document.body.style.backgroundColor = '#FFF';
      }, 150);
    }

  },

  doAnimate: function(){
    let viewer = this.state.viewer
    if (this.state.viewer){
      viewer.controls.update()
      viewer.renderer.render(viewer.scene, viewer.camera)
    }
    window.requestAnimationFrame(this.doAnimate)
  },

  componentDidMount: function() {

    let viewer = ViewerUtils.makeViewer()
    ReactDOM.findDOMNode(this).appendChild(viewer.renderer.domElement)

    let newState = React.addons.update(this.state, {
      viewer: {$set: viewer}
    });
    this.setState(newState)
    this.getIndex()

    let self = this
    key('right', function(){ self.nav(1) })
    key('left', function(){ self.nav(-1) })

    this.doAnimate()
  }
})


let App = React.createClass({

    getInitialState: () => {
      return {
        message: 'no model loaded'
      }
    },

    componentDidMount: () => {
    },
    componentWillUnmount: () => {
    },

    setMessage: function(a) {
      let newState = React.addons.update(this.state, {
        message: {$set: a}
      });
      this.setState(newState)
    },

    render: function() {
      console.log('App render')
      return <div>
          <div id='head'>live gen beta | <a href="http://inconvergent.net/">inconvergent.net</a></div>
          <div id='message'>{this.state.message}</div>
          <Viewer message={this.setMessage}/>
        </div>
    }
});


ReactDOM.render(
    <App onKeyPress={alert}/>,
    document.getElementById('container')
);

/* jshint ignore:start */
