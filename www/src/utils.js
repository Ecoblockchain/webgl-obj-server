var utils = {}
utils.loader = new THREE.OBJLoader()
utils.objs = []
utils.index = {}

utils.loadObj = function loadObj(url, viewer){
  var scale = 10

  utils.objs.forEach(function(obj){
    scene.remove(obj)
  })

  utils.loader.load(
    url,
    function (obj) {
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

        $('.message').html(url)

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
      utils.loadObj('models/'+data.recent, viewer)
    }
  })

}
