/**
 * Created by tommy_2 on 2015/11/12.
 */
$(function(){
  setMenu("dim");
  $("#saveCourt").click(function(){
    var id = $("#cord").attr("title");
    $("#"+id).attr("title",$("#key").val());
    $("#"+id).children("a").attr("title",$("#cord").val());
  });
  $("#saveDim").unbind("click").bind("click",function(){
    var court = [];
    var mm = [];
    $("#tree").children(".Node").children().children(".Node").each(function(index,item){
      var child = $(item).children("span");
      var name = child.text();
      var key = child.attr("title");
      if(key == ""){
        alert("请输入"+name+"的key值");
        return
      }
      var id = child.attr("id");
      var cord = child.children("a").attr("title");
      var datas = {
        id: id,
        name: name,
        code: cord,
        key:key,
        sub: [],
        parent_id: id,
        type_id: $("#tabShow").text()
      };
      court.push(datas);
      mm = saveChild(item,index,court);
    });
    console.log(mm);
    if($("#saveDim").attr("title") == "add") {
      $.ajax({
        data: {data: JSON.stringify(mm[0])},
        url: '/dimension/tree',
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
      })
    }else{
      $.ajax({
        data: {data: JSON.stringify(mm[0])},
        url: '/dimension/treeEdit',
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
      })
    }
  })
});
function saveChild(obj,i,court){
  $(obj).children().children(".Node").each(function(index,item){
    var child = $(item).children("span");
    var name = child.text();
    var key = child.attr("title");
    if(key == ""){
      alert("请输入"+name+"的key值")
    }
    var id = child.attr("id");
    var cord = child.children("a").attr("title");
    var datas = {
      id: id,
      name: name,
      code: cord,
      key:key,
      sub: [],
      parent_id: court[i].id
    };
    court[i].sub.push(datas);
    saveChild(item,index,court[i].sub);
  });
  return court;
}
function show(obj){
  $("#treeName").text(obj.childNodes[0].innerText);
  $("#key").val(obj.title);
  $("#cord").val(obj.childNodes[0].title)
      .attr("title",obj.id);
}
function back(){
  if(confirm("返回可能会放弃保存，是否返回？")){
    window.location.href='/dimension';
  }
}