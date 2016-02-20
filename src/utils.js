
var loader = new THREE.OBJLoader()
var objs = []
function loadobj(url, scene, material){
  var scale = 10

  objs.forEach(function(obj){
    scene.remove(obj)
  })

  loader.load(
    url,
    function (obj) {
      obj.children.forEach(function(m){
        var geom = m.geometry
        geom.computeBoundingSphere()
        geom.computeFaceNormals()
        geom.computeVertexNormals()
        var center = geom.boundingSphere.center
        mesh = new THREE.Mesh(geom, material)

        mesh.position.x -= center.x*scale
        mesh.position.y -= center.y*scale
        mesh.position.z -= center.z*scale
        mesh.scale.x = scale
        mesh.scale.y = scale
        mesh.scale.z = scale

        $('.message').html(url)

        mesh.frustumCulled = false
        console.log(mesh)
        scene.add(mesh)
        objs.push(mesh)
      })
    }
  )
}
