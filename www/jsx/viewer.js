
let ViewerUtils = {}

ViewerUtils.getWindowInfo = () => {
    let width = window.innerWidth
    let height = window.innerHeight
    let pixelRatio = window.devicePixelRatio || 1
    return {
      width: width,
      height: height,
      aspect: width/height,
      pixelRatio: pixelRatio
    }
  }

ViewerUtils.makeViewer = () => {

  let win = ViewerUtils.getWindowInfo()

  console.log('window info:', win)

  let renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: false
  })
  renderer.autoClear = true

  let camera = new THREE.PerspectiveCamera(
    40,
    win.width/win.height,
    1,
    20
  )

  let scene = new THREE.Scene()

  let camTarget = new THREE.Vector3(0,0,0)
  let camStart = new THREE.Vector3(6,6,6)
  camera.position.x = camStart.x
  camera.position.y = camStart.y
  camera.position.z = camStart.z
  camera.lookAt(camTarget)

  camera.aspect = win.aspect
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(win.pixelRatio)
  renderer.setSize(win.width,win.height)

  let controls = new THREE.OrbitControls(camera)
  controls.rotateSpeed = 1.0
  controls.zoomSpeed = 1.2
  controls.panSpeed = 1.0
  controls.noZoom = false
  controls.noPan = false
  controls.autoRotate = true
  controls.staticMoving = true
  controls.dynamicDampingFactor = 0.3
  controls.keys = [65,83,68]
  controls.target.x = camTarget.x
  controls.target.y = camTarget.y
  controls.target.z = camTarget.z


  let normalMat = new THREE.MeshNormalMaterial()
  normalMat.side = THREE.DoubleSide

  let depthMat = new THREE.MeshDepthMaterial()
  depthMat.side = THREE.DoubleSide

  let phongMat = new THREE.MeshPhongMaterial()
  phongMat.side = THREE.DoubleSide

  scene.add(camera)

  //scene.fog = fog
  //let fog = new THREE.Fog(0xffffff, 5, 30)

  let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.0 )
  hemiLight.color.setHSL(0.5, 0.0, 0.3)
  hemiLight.groundColor.setHSL(0.5, 1, 0.3)
  hemiLight.position.set(0, 10, 0)
  scene.add(hemiLight)

  renderer.render(scene, camera)

  return {
    scene: scene,
    renderer: renderer,
    camera: camera,
    controls: controls,
    normalMat: normalMat,
    depthMat: depthMat,
    phongMat: phongMat,
    objs: []
  }

}

ViewerUtils.loader = new THREE.OBJLoader()

ViewerUtils.loadObj = function loadObj(url, viewer, scale){

  scale = scale || 10

  ViewerUtils.loader.load(
    url,
    function(obj){

      obj.children.forEach(function(m){
        let geom = m.geometry
        geom.computeBoundingSphere()
        geom.computeFaceNormals()
        geom.computeVertexNormals()
        let center = geom.boundingSphere.center
        let mesh = new THREE.Mesh(geom, viewer.phongMat)

        mesh.position.x -= center.x*scale
        mesh.position.y -= center.y*scale
        mesh.position.z -= center.z*scale
        mesh.scale.x = scale
        mesh.scale.y = scale
        mesh.scale.z = scale
        mesh.frustumCulled = false

        viewer.objs.forEach(o => {
          viewer.scene.remove(o)
        })

        console.log(mesh)
        viewer.scene.add(mesh)
        viewer.objs.push(mesh)
      })
    }
  )
}
