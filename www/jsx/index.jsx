/* jshint ignore:start */

let Viewer = React.createClass({
  getInitialState: () => ({
    curr: 0,
    total: 0,
    index: {},
    updated: 0,
    viewer: undefined
  }),

  render: function() {
    return <div>
      <div id='nav'>
        <span className='nav' id='navleft' onClick={this.navLeft}>←</span> |
        <span className='nav' id='navright' onClick={this.navRight}>→</span>
      </div>
    </div>
  },

  getIndex: function(){
    Get('models/index.json', (d) => {
      let total = d.files.length
      let updated = d.updated
      let newState = React.addons.update(this.state, {
        index: {$set: d},
        curr: {$set: total-1},
        total: {$set: total},
        updated: {$set: updated}
      });
      this.setState(newState)

      let diff = ((new Date()).getTime()/1000.0 - updated)/60.0

      let tmsg = '(inactive)'
      if (diff<20.0){
        tmsg = '(' + diff.toFixed(1) + 'mins since last update)'
      }

      let msg = total + '/' + total + ' ' + tmsg
      this.props.message(msg)

      let viewer = this.state.viewer
      ViewerUtils.loadObj('models/'+d.recent, viewer)
    })
  },

  navLeft: function(){
    this.nav(-1)
  },

  navRight: function(){
    this.nav(1)
  },

  nav: function(d){
    let curr = this.state.curr
    let total = this.state.total
    let viewer = this.state.viewer
    let index = this.state.index

    let newCurr = (curr + d) % total
    if (newCurr < 0){
      newCurr = total-1
    }

    let newState = React.addons.update(this.state, {
      curr: {$set: newCurr},
    });
    this.setState(newState)

    ViewerUtils.loadObj('models/'+index.files[newCurr], viewer)

    let msg = (newCurr+1) + '/' + total
    this.props.message(msg)

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

    key('right', this.navRight)
    key('left', this.navLeft)

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
    <App/>,
    document.getElementById('container')
);

/* jshint ignore:start */
