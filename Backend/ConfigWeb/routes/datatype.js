/**
 * Created by tommy_2 on 2015/11/17.
 */
var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var client = requestClient.createClient('http://'+config.GBShowServerIP+':'+config.typeServicePort);
tempSource = [];
router.get('/', function(req, res, next) {
  client.get("/v1/source_model", function (err, resp, result) {
    if (err) {
      console.log(err)
    }
  res.render('datatype/index',{models:result});
  });
});
router.get('/template',function(req,res){
  var bool = true;
  client.get("/v1/source_model", function (err, resp, result) {
    if (err) {
      console.log(err)
    }
    if(tempSource.length == 0) {
      result.forEach(function (item) {
        if (item.id == req.query.id) {
          if (item.template == "") {
            tempSource = [];
//          bool = true;
          } else {
//          res.render('datatype/template',{id:req.query.id,models:JSON.parse(item.template)});
            tempSource = JSON.parse(item.template);
//          bool = false;
          }
        }
      });
    }

//    if(bool == true){
    res.render('datatype/template',{id:req.query.id,models:tempSource});
//    }
  });
});
router.post('/add',function(req,res){
  var source = {
    id: uuid.v4(),
    name: req.body.name,
    data_model_id:"",
    template:""
  };
  if(req.body.type == 1){
    source.data_model_id = req.body.model
  }else{
    source.data_model_id = uuid.v4();
  }
  console.log(source);
  client.post('/v1/source_model', source, function (err, resp) {
    if (!resp) {
      return res.json({code: 404, error: "服务器无法连接"});
    }
    if (resp.statusCode == 200) {
      console.log("success");
      return res.json(resp.statusCode);
    } else {
      logger.info("保存失败");
    }
  })
});
router.post('/template/add',function(req,res){
  var temp = JSON.parse(req.body.data);
  var group = [];
  temp.group.forEach(function(item) {
    item.id = uuid.v4();
    group.push(item);
  });
  var template = {
    id : temp.id,
    name: temp.name,
    type:temp.type,
    center_image_url:temp.center_image_url,
    video_group:group,
    video_count:temp.video_court
  };
  tempSource.push(template);
  console.log(tempSource);
  res.json(200);
});
router.delete('/template/del',function(req,res){
  var id = req.body.id;
  tempSource.forEach(function(item,index){
    if(item.id == id){
      tempSource.splice(index,1);
      res.json(200)
    }
  })
});
router.post('/append',function(req,res){
  var source;
  var temp = JSON.stringify(tempSource);
  console.log(tempSource);
  var val ="";
  for (var i=0;i<temp.length;i++){
    if(val == ""){
      val = temp.charCodeAt(i).toString(16);
    }else{
      val += ","+temp.charCodeAt(i).toString(16);
    }
  }
  console.log(val.split(",").length);
  var tt = "";
  for(var j = 0;j<val.split(",").length;j++){
    console.log(11);
    tt += string.fromCharCode(val.split(",")[j]);
  }
  console.log(tt);
  if(tempSource.length == 0){
    source = {
      id : req.body.id,
      template: ""
    };
  }else{
    source = {
      id : req.body.id,
      template:tt
//      template: JSON.stringify(tempSource)
    };
  }

  client.patch('/v1/source_model',source,function(err,resp) {
    console.log(resp.statusCode);
    if (!resp) {
      return res.json({code: 404, error: "服务器无法连接"});
    }
    if (resp.statusCode == 200) {
      console.log("success");
      tempSource = [];
      return res.json(resp.statusCode);
    } else {
      logger.info("保存失败");
    }
  });
});
router.delete('/del',function(req,res){
  client.del('/v1/source_model/'+req.body.id,function(err,resp) {
    console.log(resp.statusCode);
    if (!resp) {
      return res.json({code: 404, error: "服务器无法连接"});
    }
    if (resp.statusCode == 200) {
      console.log("success");
      tempSource = [];
      return res.json(resp.statusCode);
    } else {
      logger.info("保存失败");
    }
  });
});
module.exports = router;