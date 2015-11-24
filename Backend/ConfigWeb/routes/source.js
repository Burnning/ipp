/**
 * Created by tommy_2 on 2015/11/17.
 */
var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var client = requestClient.createClient('http://'+config.GBShowServerIP+':'+config.typeServicePort);

router.get('/', function(req, res, next) {
  client.get("/v1/data_model", function (err, resp, result) {
    if (err) {
      console.log(err)
    }

    res.render('source/index',{models:result});
  });
});
router.post('/add',function(req,res){
  client.post('/v1/data_model',JSON.parse(req.body.data),function(err,resp){
    console.log(resp.statusCode);
    if(!resp){return res.json(404);}
    if (resp.statusCode == 200) {
      return res.json(resp.statusCode);
    } else {
      logger.info("保存失败");
      return res.json(resp.statusCode);
    }
  })
});
router.post("/edit",function(req,res){
  client.patch('/v1/data_model',JSON.parse(req.body.data),function(err,resp){
    console.log(resp.statusCode);
    if(!resp){return res.json(404);}
    if (resp.statusCode == 200) {
      return res.json(resp.statusCode);
    } else {
      logger.info("保存失败");
      return res.json(resp.statusCode);
    }
  })
});
router.delete("/del",function(req,res){
  client.del('/v1/data_model/'+req.body.id,function(err,resp){
    console.log(resp.statusCode);
    if(!resp){return res.json(404);}
    if (resp.statusCode == 200) {
      return res.json(resp.statusCode);
    } else {
      logger.info("删除失败");
      return res.json(resp.statusCode);
    }
  })
});
module.exports = router;