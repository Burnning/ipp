/**
 * Created by tommy_2 on 2015/11/17.
 */
var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var client = requestClient.createClient('http://'+config.GBShowServerIP+':'+config.typeServicePort);

router.get('/', function(req, res, next) {
  client.get("/v1/model", function (err, resp, result) {
    if (err) {
      console.log(err)
    }
    res.render('pattern/index',{models:result});
  });
});
router.get("/type",function(req,res){
  client.get("/v1/type",function(err,resp,result){
    var data = [];
    result.forEach(function(item){
      if(item.type == 1){
        data.push(item);
      }
    });
    res.json(data)
  })
});

router.post('/patternAdd',function(req,res){
  var data = {
    id:uuid.v4(),
    name:req.body.name,
    description:req.body.description,
    data_type:req.body.dataType,
    present_type:req.body.preType,
    action:req.body.action,
    effect:req.body.effect,
    width:req.body.width,
    height:req.body.height,
    slope:req.body.slope,
    refresh:req.body.refresh,
    is_data_depend:true
  };
  if(req.body.depend == "true"){
    data.is_data_depend = true;
  }else{
    data.is_data_depend = false;
  }
  console.log(data);
  client.post("/v1/model",data,function(err, resp, result){
    console.log(resp.statusCode);
    if(!resp){return res.json(404);}
    if (resp.statusCode == 200) {
      return res.json(resp.statusCode);
    } else {
      logger.info("保存失败");
      return res.json(resp.statusCode);
    }
  });
});
router.post('/patternEdit',function(req,res){
  var data = {
    id:req.body.id,
    name:req.body.name,
    description:req.body.description,
    data_type:req.body.dataType,
    present_type:req.body.preType,
    action:req.body.action,
    effect:req.body.effect,
    width:req.body.width,
    height:req.body.height,
    slope:req.body.slope,
    refresh:req.body.refresh,
    is_data_depend:false
  };
  if(req.body.depend == "true"){
    data.is_data_depend = true;
  }else{
    data.is_data_depend = false;
  }
  console.log(data);
  client.patch("/v1/model",data,function(err, resp, result){
    console.log(resp.statusCode);
    if(!resp){return res.json(404);}
    if (resp.statusCode == 200) {
      return res.json(resp.statusCode);
    } else {
      logger.info("保存失败");
      return res.json(resp.statusCode);
    }
  });
});
router.delete('/del/:id',function(req,res){
  client.del("/v1/model/"+req.params.id,function(err,resp,result){
    if(!resp){return res.json(404);}
    if (resp.statusCode != 200) {
      logger.info("删除失败");
    }
    return res.json(resp.statusCode);
  })
});
module.exports = router;