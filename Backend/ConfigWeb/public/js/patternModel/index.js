/**
 * Created by tommy_2 on 2015/11/17.
 */
$(function() {
  setMenu("pat");
  $("#patternModal").on('show.bs.modal', function (e) {
    var id = $(e.relatedTarget).data('id');
    var page = $(e.relatedTarget).data('type');
    var html = $(e.relatedTarget).data('html');
    if (page == 'edit') {
      $('#patternName').val(html.split("/")[0]);
      $('#patternDes').val(html.split("/")[1]);
      $('#data_type').val(html.split("/")[2]);
      $('#present_type').val(html.split("/")[3]);
      $('#patternAction').val(html.split("/")[4]);
      $('#patternEffect').val(html.split("/")[5]);
      $('#patternWidth').val(html.split("/")[6]);
      $('#patternHeight').val(html.split("/")[7]);
      $('#patternSlope').val(html.split("/")[8]);
      $('#patternRefresh').val(html.split("/")[9]);
      if(html.split("/")[10] == 'false'){
        $("#depend").attr("checked",false);
      }else{
        $("#depend").attr("checked",true);
      }
      $("#laySave").unbind('click').bind('click', function () {
        edit(id);
      });
    } else {
      $('#patternName').val("");
      $('#patternDes').val("");
      $('#data_type').val("");
      $('#present_type').val("");
      $('#patternAction').val("");
      $('#patternEffect').val("");
      $('#patternWidth').val("");
      $('#patternHeight').val("");
      $('#patternSlope').val("");
      $('#patternRefresh').val("");
      $("#laySave").unbind('click').bind('click', function () {
        save();
      });
    }
  });
  $("#data_type").click(function(){
    selectType("数据类型");

  });
  $("#present_type").click(function(){
    selectType("呈现类型")
  });
  $("#paAction").click(function(){
    selectType("动作效果")
  });
  $("#paEffect").click(function(){
    selectType("呈现效果")
  });
  $("#saveType").click(function(){
    var data = "";
    $("#typeBody").children("tr").each(function(){
      if($(this).children('.aa').children().prop("checked") == true){
        data += $(this).children('.bb').text()+",";
      }
    });
    switch ($(this).attr("title")){
      case "dataType":
        $("#data_type").val(data.split(",")[0]);
        break;
      case "showType":
        $("#present_type").val(data.split(",")[0]);
        break;
      case "actionEffect":
        $("#patternAction").val(data);
        break;
      case "showEffect":
        $("#patternEffect").val(data);
        break;
    }
    $("#selectType").css("display","none");
  });

  $("#cancelType").click(function(){
    $("#selectType").css("display","none")
  });
});
function save(){
  var pat = check();
  if(pat.bool == true){
    $.ajax({
      data:{name:pat.name,description:pat.des,dataType:pat.dataType,preType:pat.preType,action:pat.action,effect:pat.effect,width:pat.width,height:pat.height,slope:pat.slope,refresh:pat.refresh,depend:pat.depend},
      url: '/pattern/patternAdd',
      type: 'post',
      dataType: 'json',
      async: false,
      success: function (data) {
        if (data !== 200) {
          alert("未知错误");
        } else {
          window.location.reload();
        }
      }
    })
  }
}
function edit(id){
  var pat = check();
  if(pat.bool == true){
    $.ajax({
      data:{id:id,name:pat.name,description:pat.des,dataType:pat.dataType,preType:pat.preType,action:pat.action,effect:pat.effect,width:pat.width,height:pat.height,slope:pat.slope,refresh:pat.refresh,depend:pat.depend},
      url: '/pattern/patternEdit',
      type: 'post',
      dataType: 'json',
      async: false,
      success: function (data) {
        if (data !== 200) {
          alert("未知错误");
        } else {
          window.location.reload();
        }
      }
    })
  }
}
function check(){
  var bool = true;
  var show = $("#layShow");
  show.text("");
  var name = $("#patternName").val();
  var description = $("#patternDes").val();
  var dataType = $("#data_type").val();
  var preType = $("#present_type").val();
  var action = $("#patternAction").val();
  var effect = $("#patternEffect").val();
  var width = $("#patternWidth").val();
  var height = $("#patternHeight").val();
  var slope = $("#patternSlope").val();
  var refresh = $("#patternRefresh").val();
  var depend = $("#depend").prop("checked");
  var num = /^[0-9]*$/;
  var eng = /^\w+$/;
  if(name==""||description==""||preType==""||dataType==""||action==""||effect==""||width==""||height==""||slope==""||refresh==""){
    show.text("请输入所有完整的数据");
    return
  }
  if(!eng.test(name)){
    bool = false
  }else if(!num.test(width)||!num.test(height)||!num.test(slope)||!num.test(refresh)){
    bool = false
  }
  if(0>slope||slope>360){
    show.text("请输入正确斜率范围（0-360）");
    return
  }
  if(bool == false){
    show.text("请输入正确格式");
  }else{
    return {
      name:name,
      des:description,
      dataType:dataType,
      preType:preType,
      action:action,
      effect:effect,
      width:width,
      height:height,
      slope:slope,
      refresh:refresh,
      depend:depend,
      bool:bool
    };
  }
}
function del(id){
  $.ajax({
    url: '/pattern/del/'+id,
    type: 'delete',
    dataType: 'json',
    async: false,
    success: function (data) {
      if (data !== 200) {
        alert("未知错误");
      } else {
        window.location.reload();
      }
    }
  })
}
function selectType(name){
  $("#typeBody").children().remove();
  var type;
  switch (name){
    case "数据类型":
      type = 'dataType';
      break;
    case "呈现类型":
      type = 'showType';
      break;
    case  "动作效果":
      type = "actionEffect";
      break;
    case "呈现效果":
      type = 'showEffect';
      break;
  }
  $("#selectType").css("display","block");
  $.get("pattern/type",function(data){
    data.forEach(function(item){
      if(item.name == name) {
        var tr;
        if(item.is_multi_select == true){
          tr = "<tr><td class='aa'><input type='checkbox' name='"+type+"' /></td><td class='bb'>" + item.key + "</td></tr>";
        }else{
          tr = "<tr><td class='aa'><input type='radio' name='"+type+"' /></td><td class='bb'>" + item.key + "</td></tr>";
        }
        $("#typeBody").append(tr);
        checkType(type);
        $("#saveType").attr("title",type)
      }
    })
  })
}
function checkType(type){
  $("input[type='radio'][name='"+type+"']").click(function(){
    $("input[type='checkbox'][name='"+type+"']").prop("checked",false);
  });
  $("input[type='checkbox'][name='"+type+"']").click(function(){
    $("input[type='radio'][name='"+type+"']").attr("checked",false);
  });
}