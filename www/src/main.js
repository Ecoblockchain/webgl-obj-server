
var camera
var renderer
var offset
var $container
var controls
var stats

var winWidth = window.innerWidth
var winHeight = window.innerHeight
var viewRatio = winWidth/winHeight

var rinit = 1000

var pixelRatio = window.devicePixelRatio || 1
var viewWinWidth = 2.2*rinit
var viewWinHeight = viewWinWidth / viewRatio
console.log('screen ratio', viewRatio, viewWinWidth, viewWinHeight)


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
;(function() {
    var lastTime = 0
    var vendors = ['ms', 'moz', 'webkit', 'o']
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame']
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
          window[vendors[x]+'CancelRequestAnimationFrame']
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime()
            var timeToCall = Math.max(0, 16 - (currTime - lastTime))
            var id = window.setTimeout(function() { callback(currTime + timeToCall) },
              timeToCall)
            lastTime = currTime + timeToCall
            return id
        }

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id)
        }
}())


;(function() {
  var timer_id
  $(window).resize(function() {
      clearTimeout(timer_id)
      timer_id = setTimeout(function() {
        windowAdjust()
      }, 300)
  })
}())


function windowAdjust() {

  winWidth = window.innerWidth
  winHeight = window.innerHeight
  offset = $container.offset()
  pixelRatio = window.devicePixelRatio || 1

  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(winWidth,winHeight)

  camera.aspect = winWidth/winHeight
  camera.updateProjectionMatrix()

  console.log('window', winWidth,winHeight)
  console.log('pixel ratio', pixelRatio)

  viewRatio = window.innerWidth/window.innerHeight
  viewWinWidth = 2*rinit
  viewWinHeight = viewWinHeight / viewRatio
  console.log('screen ratio', viewRatio, viewWinWidth, viewWinHeight)
}

$(document).ready(function(){

  if (!Detector.webgl){
    Detector.addGetWebGLMessage()
  }

  console.log('start')

  $container = $('#box')

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: false
  })
  renderer.autoClear = true
  $container.append(renderer.domElement)

  camera = new THREE.PerspectiveCamera(
    40,
    winWidth/winHeight,
    1,
    20000
  )

  scene = new THREE.Scene()

  var camTarget = new THREE.Vector3(0,0,0)
  var camStart = new THREE.Vector3(10,10,10)
  camera.position.x = camStart.x
  camera.position.y = camStart.y
  camera.position.z = camStart.z
  camera.lookAt(camTarget)

  camera.aspect = viewRatio
  camera.updateProjectionMatrix()

  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(winWidth,winHeight)

  scene.add(camera)

  controls = new THREE.OrbitControls(camera)
  if (controls){
    controls.rotateSpeed = 1.0
    controls.zoomSpeed = 1.2
    controls.panSpeed = 1.0
    controls.noZoom = false
    controls.noPan = false
    //controls.autoRotate = true
    controls.staticMoving = true
    controls.dynamicDampingFactor = 0.3
    controls.keys = [65,83,68]
    controls.target.x = camTarget.x
    controls.target.y = camTarget.y
    controls.target.z = camTarget.z
  }

  var normalMat = new THREE.MeshNormalMaterial()
  normalMat.side = THREE.DoubleSide

  //var basicMat = new THREE.MeshBasicMaterial({
      //color: 0x00EEEE
  //})
  //basicMat.side = THREE.DoubleSide

  windowAdjust()
  //loadObj('models/test2.obj', scene, normalMat)
  //getModelIndex('models/index.json')
  var viewer = {
    material: normalMat,
    scene: scene
  }
  utils.updateIndex('models/index.json', viewer)

  $(document).keydown(function(e) {
    switch(e.which) {
        //case 38: // up
        //break;
        //case 40: // down
        //break;
        case 37: // left
          utils.prevModel(viewer)
        break

        case 39: // right
          utils.nextModel(viewer)
        break
        default: return // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

  var itt = 0.0
  function animate(){

    itt += 1.0

    if (itt%50===0){
      console.log(itt)
    }
    if (controls){
      controls.update()
    }
    if (stats){
      stats.update()
    }

    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)

  }

  animate()
})

