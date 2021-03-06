$(function(){
  setMenu("dim");
  $("#meetingModal").on('show.bs.modal',function(e) {
    $(this).find("#status").html("").css('display', 'none');
    var id = $(e.relatedTarget).data('id');
    var page = $(e.relatedTarget).data('type');
    var html = $(e.relatedTarget).data('html');
    if (page == 'edit') {
      $('#dimName').val(html.split("/")[0]);
      $('#dimAlias').val(html.split("/")[1]);
      $("#saveTem").unbind('click').bind('click', function () {
        edit(id);
      });
    } else{
      $('#dimName').val("");
      $('#dimAlias').val("");
      $("#saveTem").unbind('click').bind('click', function () {
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
  var type = 0;
  var id;
  $.get("/dimension/id", function (data) {
    id = data;
    $.ajax({
      data: {id: id, name: alias, alias: name, type: type},
      url: '/dimension/type',
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
  $.ajax({
    data: {id: id, name: name, alias: alias,type:0},
    url: '/dimension/typeEdit/',
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
    url: '/dimension/type/' + id,
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