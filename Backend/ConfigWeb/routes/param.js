/**
 * Created by tommy_2 on 2015/11/17.
 */
var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var client = requestClient.createClient('http://'+config.GBShowServerIP+':'+config.typeServicePort);

router.get('/', function(req, res, next) {
  client.get("/v1/type",function(err,resp,result){
    if(err){return res.json({code:404})}
    var data = [];
    result.forEach(function(item){
      if(item.type == 1){
        data.push(item);
      }
    });
    res.render('param/index',{models:data});
  });
});
router.get('/enum',function(req,res){
  var id = req.query.id;
  var modal = [];
  var bool = true;
  client.get("/v1/dimension", function (err, resp, result) {
    if (err) {
      return res.json({code: 404, error: "服务器无法连接"});
    }
    result.list.forEach(function (item) {
      if(item.type_id == id){
        var len =item.name.split(",").length;
        for(var i = 0;i<len-1;i++){
          var data = {
            name:item.name.split(",")[i],
            key:item.key.split(",")[i]
          };
          modal.push(data)
        }
        console.log(modal);
        res.render('param/enum',{id:id,name:req.query.name,models:modal,enums:item,type:"edit",code:item.code});
        bool = false
      }
    });
    if(bool){
      res.render('param/enum',{id:id,name:req.query.name,models:[],enums:"",type:"add",code:""})
    }
  });

});

router.post("/enum",function(req,res){
  var data = req.body.data;
  client.post("/v1/dimension",JSON.parse(data),function(err,resp,result){
    console.log(resp.statusCode);
    if(!resp){return res.json({code:404,error:"服务器无法连接"});}
    if (resp.statusCode == 200) {
      return res.json({code:resp.statusCode});
    } else {
      logger.info("更新错误:"+resp.statusCode);
    }
  })
});
router.post("/enumEdit",function(req,res){
  var data = req.body.data;
  console.log(data);
  client.put("/v1/dimension",JSON.parse(data),function(err,resp,result){
    console.log(resp.statusCode);
    if(!resp){return res.json({code:404,error:"服务器无法连接"});}
    if (resp.statusCode == 200) {
      return res.json({code:resp.statusCode});
    } else {
      logger.info("更新错误:"+resp.statusCode);
    }
  })
});
router.post("/add",function(req,res){
  var bool = false;
  if(req.body.bool == "true"){
    bool = true;
  }
  var data = {
    id:req.body.id,
    name:req.body.name,
    key:req.body.alias,
    type:parseInt(req.body.type),
    is_multi_select:bool
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
router.post('/edit',function(req,res){
  var data ={
    id:req.body.id,
    name:req.body.name,
    key:req.body.key,
    type:parseInt(req.body.type)
  };
  client.patch("/v1/type",data,function(err, resp, result){
    if(!resp){return res.json({code:404,error:"服务器无法连接"});}
    if (resp.statusCode == 200) {
      console.log("success");
      return res.json({code:resp.statusCode});
    } else {
      logger.info("保存失败");
    }
  });
});
router.delete('/:id',function(req,res){
  client.del("/v1/type/"+req.params.id,function(err, resp, result){
    if(!resp){return res.json({code:404,error:"服务器无法连接"});}
    if (resp.statusCode == 200) {
      console.log("success");
      return res.json({code:resp.statusCode});
    } else {
      logger.info("保存失败");
    }
  });
});
module.exports = router;