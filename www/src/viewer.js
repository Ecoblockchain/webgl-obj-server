'use strict';

var ViewerUtils = {};

ViewerUtils.getWindowInfo = function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var pixelRatio = window.devicePixelRatio || 1;
  return {
    width: width,
    height: height,
    aspect: width / height,
    pixelRatio: pixelRatio
  };
};

ViewerUtils.makeViewer = function () {

  var win = ViewerUtils.getWindowInfo();

  console.log('window info:', win);

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: false
  });
  renderer.autoClear = true;

  var camera = new THREE.PerspectiveCamera(40, win.width / win.height, 1, 20000);

  var scene = new THREE.Scene();

  var camTarget = new THREE.Vector3(0, 0, 0);
  var camStart = new THREE.Vector3(7, 7, 7);
  camera.position.x = camStart.x;
  camera.position.y = camStart.y;
  camera.position.z = camStart.z;
  camera.lookAt(camTarget);

  camera.aspect = win.aspect;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(win.pixelRatio);
  renderer.setSize(win.width, win.height);

  var controls = new THREE.OrbitControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 1.0;
  controls.noZoom = false;
  controls.noPan = false;
  //controls.autoRotate = true
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [65, 83, 68];
  controls.target.x = camTarget.x;
  controls.target.y = camTarget.y;
  controls.target.z = camTarget.z;

  var normalMat = new THREE.MeshNormalMaterial();
  normalMat.side = THREE.DoubleSide;

  scene.add(camera);

  //var sphere = new THREE.SphereGeometry(3, 20, 20)
  //var sphereMesh = new THREE.Mesh(sphere, normalMat)
  //scene.add(sphereMesh)

  renderer.render(scene, camera);

  return {
    scene: scene,
    renderer: renderer,
    camera: camera,
    controls: controls,
    normalMat: normalMat,
    objs: []
  };
};

ViewerUtils.loader = new THREE.OBJLoader();

ViewerUtils.loadObj = function loadObj(url, viewer, scale) {

  scale = scale || 10;

  viewer.objs.forEach(function (obj) {
    viewer.scene.remove(obj);
  });

  ViewerUtils.loader.load(url, function (obj) {

    obj.children.forEach(function (m) {
      var geom = m.geometry;
      geom.computeBoundingSphere();
      geom.computeFaceNormals();
      geom.computeVertexNormals();
      var center = geom.boundingSphere.center;
      var mesh = new THREE.Mesh(geom, viewer.normalMat);

      mesh.position.x -= center.x * scale;
      mesh.position.y -= center.y * scale;
      mesh.position.z -= center.z * scale;
      mesh.scale.x = scale;
      mesh.scale.y = scale;
      mesh.scale.z = scale;
      mesh.frustumCulled = false;
      console.log(mesh);
      viewer.scene.add(mesh);
      viewer.objs.push(mesh);
    });
  });
};