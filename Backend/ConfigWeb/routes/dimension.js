var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var client = requestClient.createClient('http://'+config.GBShowServerIP+':'+config.typeServicePort);

router.get('/', function(req, res, next) {
  client.get("/v1/type",function(err,resp,result){
    if(err){return res.json({code:404})}
    var data = [];
    result.forEach(function(item){
      if(item.type == 0){
        data.push(item);
      }
    });
    res.render('dimension/index',{models:data});
  });
});
router.get("/court",function(req,res){
  res.render('dimension/court',{id:req.query.id,name:req.query.name})
});
router.get('/id',function(req, res){
  res.json(uuid.v4())
});
router.get('/data',function(req,res){
  var bool = true;
  var id  = req.query.id;
  if(id) {
    console.log(111);
    client.get("/v1/dimension", function (err, resp, result) {
      if (err) {
        return res.json({code: 404, error: "服务器无法连接"});
      }
      result.list.forEach(function (item) {
        if(item.type_id == id){
          res.json(item);
          bool = false
        }
      });
      if(bool == true){
        res.json("none");
      }
    });
  }
});
router.post("/type",function(req,res){
  var data = {
    id:req.body.id,
    name:req.body.name,
    key:req.body.alias,
    type:parseInt(req.body.type)
  };
  client.post("/v1/type",data,function(err, resp, result){
    if(!resp){return res.json({code:404,error:"服务器无法连接"});}
    if (resp.statusCode == 200) {
      console.log("success");
      return res.json({code:resp.statusCode});
    } else {
      logger.info("保存失败");
    }
  });
});
router.post("/typeEdit",function(req,res){
  var data = {
    id:req.body.id,
    name:req.body.name,
    description:req.body.alias,
    type:parseInt(req.body.type)
  };
  client.patch("/v1/type",data,function(err,resp,result){
    if(!resp){return res.json({code:404,error:"服务器无法连接"});}
    if(resp.statusCode==200) {
      logger.info("更新成功：" + req.body.id);
      return res.json({code:200});
    }else {
      return res.json({code: resp.statusCode, error: "更新报错"});
    }
  })
});
router.post("/tree",function(req,res){
  var data = req.body.data;
  console.log(data);
  client.post("/v1/dimension",JSON.parse(data),function(err, resp, result){
    console.log(resp.statusCode);
    if(!resp){return res.json({code:404,error:"服务器无法连接"});}
    if (resp.statusCode == 200) {
      return res.json({code:resp.statusCode});
    } else {
      logger.info("保存失败");
    }
  });
});
router.post("/treeEdit",function(req,res){
  var data = req.body.data;
  client.put("/v1/dimension",JSON.parse(data),function(err, resp, result){
    console.log(resp.statusCode);
    if(!resp){return res.json({code:404,error:"服务器无法连接"});}
    if (resp.statusCode == 200) {
      return res.json({code:resp.statusCode});
    } else {
      logger.info("保存失败");
    }
  });
});

router.delete("/type/:id",function(req,res){
  var id = req.params.id;
  client.del("/v1/type/"+id,function(err,resp,result){
    if(!resp){return res.json({code:404,error:"服务器无法连接"});}
    if (resp.statusCode == 200) {
      return res.json({code:resp.statusCode});
    } else {
      logger.info("删除失败");
    }
  })
});

module.exports = router;
