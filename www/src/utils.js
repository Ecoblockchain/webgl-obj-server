var utils = {}
utils.loader = new THREE.OBJLoader()
utils.objs = []
utils.index = {}
utils.cur = 0

utils.loadObj = function loadObj(url, viewer){
  var scale = 10

  utils.objs.forEach(function(obj){
    scene.remove(obj)
  })

  utils.loader.load(
    url,
    function(obj){

      var which = utils.tot + '/' + utils.tot
      $('.message').html(which + ': ' + url)

      obj.children.forEach(function(m){
        var geom = m.geometry
        geom.computeBoundingSphere()
        geom.computeFaceNormals()
        geom.computeVertexNormals()
        var center = geom.boundingSphere.center
        mesh = new THREE.Mesh(geom, viewer.material)

        mesh.position.x -= center.x*scale
        mesh.position.y -= center.y*scale
        mesh.position.z -= center.z*scale
        mesh.scale.x = scale
        mesh.scale.y = scale
        mesh.scale.z = scale
        mesh.frustumCulled = false
        console.log(mesh)
        viewer.scene.add(mesh)
        utils.objs.push(mesh)
      })
    }
  )
}

utils.updateIndex = function updateIndex(url, viewer){
  $.ajax({
  dataType: "json",
  url: url,
  success: function(data){
      utils.index = data
      var tot = data.files.length
      utils.tot = tot
      utils.cur = tot-1
      utils.loadObj('models/'+data.recent, viewer)
    }
  })
}

utils.nextModel = function nextModel(viewer){

  console.log('next model')
  var newCur = utils.cur + 1
  if (newCur>=utils.tot){
    console.log('viewing most recent')
    return
  }

  var file = utils.index.files[newCur]
  utils.cur = newCur
  utils.loadObj('models/'+file, viewer)

}

utils.prevModel = function prevModel(viewer){
  console.log('prev model')
  var newCur = utils.cur - 1
  if (utils.cur<=0){
    console.log('no older models')
    return
  }

  var file = utils.index.files[newCur]
  utils.cur = newCur
  utils.loadObj('models/'+file, viewer)
}

