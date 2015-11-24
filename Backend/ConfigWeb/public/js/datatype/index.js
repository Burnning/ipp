/**
 * Created by tommy_2 on 2015/11/17.
 */
$(function(){
  setMenu("datatype");
  $("#templateModal").on('show.bs.modal',function(e) {
    $(this).find("#status").html("").css('display', 'none');
    var id = $(e.relatedTarget).data('id');
    var page = $(e.relatedTarget).data('type');
    var html = $(e.relatedTarget).data('html');
    if (page == 'edit') {
      $('#dimName').val(html.split("/")[0]);
      $('#dimAlias').val(html.split("/")[1]);
      $("#saveTem").unbind('click').bind('click', function () {
        temEdit(id);
      });
    } else{
      $('#temName').val("");
      $('#temType').val("");
      $('#temImg').val("");
      $("#addVideo").prop("checked",false);
      $("#saveTem").unbind('click').bind('click', function () {
        temSave();
      });
    }
  });
  $("#dataModal").on('show.bs.modal',function(e) {
    $(this).find("#status").html("").css('display', 'none');
    var id = $(e.relatedTarget).data('id');
    var page = $(e.relatedTarget).data('type');
    var html = $(e.relatedTarget).data('html');
    if (page == 'edit') {
      $('#dimName').val(html.split("/")[0]);
      $('#dimAlias').val(html.split("/")[1]);
      $("#saveData").unbind('click').bind('click', function () {
        edit(id);
      });
    } else{
      $('#dataName').val("");
      $("#saveData").unbind('click').bind('click', function () {
        dataSave();
      });
    }
  });
  $("#dataChoose").change(function(){
    if($(this).val() == 1){
      $("#dataType").css("display","table")
    }else{
      $("#dataType").css("display","none")
    }
  });
  $("#addVideo").click(function(){
    var group = $("#videoGroup");
    if($(this).prop("checked") == false){
      group.css("display","none");
      $("#v_add").css("display","none");
    }else{
      group.css("display","block");
      $("#v_add").css("display","block");
      if(group.children(".vGroup").length == 0){
        var video = "<div class='vGroup'><div class='col-sm-5'><div class='input-group'><span class='input-group-addon'>名称</span>" +
          "<input class='form-control vG_Name' /></div></div><div class='col-sm-6'><div class='input-group'><span class='input-group-addon'>" +
          "路径</span><input class='form-control vG_Url' /></div></div><span class='col-sm-1 glyphicon glyphicon-remove-circle v_remove'></span></div>";
        group.append(video);
        remove();
      }
    }
  });
  $("#v_add").click(function(){
    var video = "<div class='vGroup'><div class='col-sm-5'><div class='input-group'><span class='input-group-addon'>名称</span>" +
      "<input class='form-control vG_Name' /></div></div><div class='col-sm-6'><div class='input-group'><span class='input-group-addon'>" +
      "路径</span><input class='form-control vG_Url' /></div></div><span class='col-sm-1 glyphicon glyphicon-remove-circle v_remove'></span></div>";
    $("#videoGroup").append(video);
    remove()
  });

});
function remove(){
  $(".v_remove").click(function(){
    var len = $("#videoGroup").children(".vGroup").length;
    if( len== 1){
      $("#videoGroup").css("display","none");
      $("#v_add").css("display","none");
      $("#v_remove").css("display","none");
      $("#addVideo").prop("checked",false);
    }else{
      $(this).parents(".vGroup").remove();
    }
  });
}
function temSave(){
  var name = $("#temName").val();
  var type = $("#temType").val();
  var img = $('#temImg').val();
  var group = [];
  var num;
  if($("#addVideo").prop("checked") == true){
    $("#videoGroup").children(".vGroup").each(function(index){
      var data = {
        id: "",
        url:$(this).find(".vG_Url").val(),
        name:$(this).find(".vG_Name").val(),
        index:index-1+2
      };
      group.push(data);
      num = index-1+2;
    });
  }
  $.get("/dimension/id", function (id) {
    var datas = {
      id : id,
      name:name,
      type:type,
      center_image_url:img,
      group:group,
      video_court:num
    };
    console.log(datas);
    $.ajax({
      data: {data: JSON.stringify(datas)},
      url: '/datatype/template/add',
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
    });
  });
}
function dataSave(){
  var name =$("#dataName").val();
  var model = $("#dataType").children("input").val().trimAll();

  var type = $("#dataChoose").val();
  if(type == 1&&model == ""){
    alert("请输入数据模型ID");
    return
  }
  $.ajax({
    data: {name:name,model:model,type:type},
    url: '/datatype/add',
    type: 'post',
    dataType: 'json',
    async: false,
    success: function (data) {
      if(data == 600){
        alert("没有该数据源")
      }else if (data !== 200) {
        alert("未知错误");
      } else {
        window.location.reload();
      }
    }
  });
}
function del(id) {
  $.ajax({
    data: {id:id},
    url: '/datatype/del',
    type: 'delete',
    dataType: 'json',
    async: false,
    success: function (data) {
      if (data == 600) {
        alert("没有该数据源")
      } else if (data !== 200) {
        alert("未知错误");
      } else {
        window.location.reload();
      }
    }
  });
}
function tempDel(id){
  $("#"+id).remove();
  $.ajax({
    data: {id:id},
    url: '/datatype/template/del',
    type: 'delete',
    dataType: 'json',
    async: false,
    success: function (data) {
      if(data != 200){
        alert("删除失败")
      }
    }
  });
}
function saveall(){
  var sourceId = $("#temid").text();
  $.ajax({
    data: {id:sourceId},
    url: '/datatype/append',
    type: 'post',
    dataType: 'json',
    async: false,
    success: function (data) {
      if (data == 600) {
        alert("没有该数据源")
      } else if (data !== 200) {
        alert("未知错误");
      } else {
        window.location.reload();
      }
    }
  });
}