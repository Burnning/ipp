/**
 * Created by tommy_2 on 2015/11/17.
 */
$(function(){
  setMenu("source");
  $("#sourceModal").on('show.bs.modal',function(e) {
    $(this).find("#status").html("").css('display', 'none');
    var id = $(e.relatedTarget).data('id');
    var page = $(e.relatedTarget).data('type');
    var html = $(e.relatedTarget).data('html');
    if (page == 'edit') {
      $('#sourceName').val(html.split("/")[0]);
      $('#type_id').val(html.split("/")[1]);
      $('#dataDes').val(html.split("/")[2]);
      $('#group_name').val(html.split("/")[3]);
      $("#save").unbind('click').bind('click', function () {
        edit(id);
      });
    } else{
      $('#sourceName').val("");
      $('#type_id').val("");
      $('#dataDes').val("");
      $('#group_name').val("");
      $("#save").unbind('click').bind('click', function () {
        save();
      });
    }
  });
});
function save(){
  $.get("/dimension/id", function (id) {
    var source={
      id:id,
      name:$('#sourceName').val(),
      type_id:$('#type_id').val(),
      description:$('#dataDes').val(),
      group_name:$('#group_name').val()
    };
    $.ajax({
      data: {data: JSON.stringify(source)},
      url: '/source/add',
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
  })
}
function edit(id){
  var source={
    id:id,
    name:$('#sourceName').val(),
    type_id:$('#type_id').val(),
    description:$('#dataDes').val(),
    group_name:$('#group_name').val()
  };
  $.ajax({
    data: {data: JSON.stringify(source)},
    url: '/source/edit',
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
}
function del(id){
  $.ajax({
    data: {id:id},
    url: '/source/del',
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
  });
}