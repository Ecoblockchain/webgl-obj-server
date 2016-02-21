var utils = {}
utils.loader = new THREE.OBJLoader()
utils.objs = []
utils.index = {}
utils.cur = 0

function dearLordKillMeNow(){
  var now = new Date()
  var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(),
                         now.getUTCDate(),  now.getUTCHours(),
                         now.getUTCMinutes(), now.getUTCSeconds())
  return new Date(now_utc.toJSON())
}

utils.loadObj = function loadObj(url, viewer){
  var scale = 10

  utils.objs.forEach(function(obj){
    scene.remove(obj)
  })

  utils.loader.load(
    url,
    function(obj){

      //var seconds = (new Date(new Date().toUTCString()) -
                     //Date.parse(utils.index.updated))/1000.0
      //var seconds = (new Date(new Date().toUTCString()) - Date.parse(utils.index.updated))/1000

      //console.log(new Date(new Date().toUTCString()))
      //console.log(Date.parse(utils.index.updated))

            //(new Date(new Date().toUTCString()) - Date.parse("2016/02/21 17:14:12.47 GMT"))/1000
      var seconds = (dearLordKillMeNow()-Date.parse(utils.index.updated))/1000.0

      var which = (utils.cur+1)+ '/' + utils.tot + ' (' +
        seconds.toFixed(0) + 's since last update)'

      $('.message').html(which)

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

