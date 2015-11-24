/**
 * Created by tommy_2 on 2015/11/17.
 */
$(function(){
  setMenu("param");
  $("#sourceModal").on('show.bs.modal',function(e) {
    $(this).find("#status").html("").css('display', 'none');
    var id = $(e.relatedTarget).data('id');
    var page = $(e.relatedTarget).data('type');
    var html = $(e.relatedTarget).data('html');
    if (page == 'edit') {
      $('#dimName').val(html.split("/")[0]);
      $('#dimAlias').val(html.split("/")[1]);
      if(html.split("/")[2] == 'true'){
        $("#multiple").prop("checked",true);
      }else{
        $("#multiple").prop("checked",false);
      }
      $("#save").unbind('click').bind('click', function () {
        edit(id);
      });
    } else{
      $('#dimName').val("");
      $('#dimAlias').val("");
      $("#multiple").prop("checked",false);
      $("#save").unbind('click').bind('click', function () {
        save();
      });
    }
  });
});
function save() {
  var name = $("#dimName").val();
  var eng = /^\w+$/;
  if (!eng.test(name)) {
    $("#showMess").html("名称不能输入中文");
    return
  }
  var alias = $("#dimAlias").val();
  if (name.trimAll() == "" || alias.trimAll() == "") {
    $("#showMess").html("请填满选项");
    return
  }
  var mul = $("#multiple").prop("checked");
  var id;
  $.get("/dimension/id", function (data) {
    id = data;
    $.ajax({
      data: {id: id, name: alias, alias: name, type: 1,bool:mul},
      url: '/param/add',
      type: 'post',
      dataType: 'json',
      async: false,
      success: function (data) {
        if (data.code !== 200) {
          alert("未知错误");
        } else {
          window.location.reload();
        }
      }
    });
  });
}
function edit(id){
  var name = $("#dimName").val();
  var alias = $("#dimAlias").val();
  $.ajax({
    data: {id: id, name: alias, key: name,type:1},
    url: '/param/edit/',
    type: 'post',
    dataType: 'json',
    async: false,
    success: function (data) {
      if (data.code !== 200) {
        alert("未知错误");
      } else {
        window.location.reload();
      }
    }
  });
}
function del(id){
  $.ajax({
    url: '/param/' + id,
    type:'delete',
    dataType:'json',
    async:false,
    success:function(data){
      if (data.code == 200) {
        window.location.reload();
      }else{
        alert("未知错误");
      }
    }
  })
}