/**
 * Created by huangchaohui on 15/11/15.
 */
var bool = true;
$(function(){
  setMenu("param");
  $("#save").click(function(){
    var name = $("#enumName").val();
    var key = $("#enumKey").val();
    var eng = /^\w+$/;
    if (!eng.test(key)) {
      alert("名称不能输入中文");
      return
    }
    $.get("/dimension/id", function (data) {
      var tr = "<tr id='"+data+"'><td class='eName'>" + name + "</td><td class='eKey'>"+key+"</td><td><button class='btn btn-xs btn-danger' onclick='del(&quot;"+data+"&quot;)'>删除</button></td></tr>";
      $("#enumBody").append(tr);
      $("#enumName").val("");
      $("#enumKey").val("");
      bool = false;
    })
  })
});
function del(id){
  $("#"+id).remove();
}
function saveall(str){
    var data = {
      id:$("#enumBody").attr("title"),
      name:"",
      code:$("#enumCode").val(),
      key:"",
      sub:[],
      parent_id:$("#enumBody").attr("title"),
      type_id:$("#enumShow").text()
    };
    $("#enumBody tr").each(function(){
      data.name += $(this).children("td[class='eName']").text()+",";
      data.key +=$(this).children("td[class='eKey']").text()+",";
    });
    console.log(data);
  if(str == "add"){
    $.get("/dimension/id", function (id) {
      data.id = id;
      data.parent_id = id;
      $.ajax({
        data:{data:JSON.stringify(data)},
        url: '/param/enum',
        type:'post',
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
    })
  }else if(str == "edit"){
    $.ajax({
      data:{data:JSON.stringify(data)},
      url: '/param/enumEdit',
      type:'post',
      dataType:'json',
      async:false,
      success:function(data){
        if (data.code == 200) {
          alert("保存成功");
          window.location.reload();
        }else{
          alert("未知错误");
        }
      }
    })
  }
}
function backparam(){
  if(bool == false){
    if(confirm("数据未保存，是否返回?")){
      window.location.href='/param';
    }
  }else{
    window.location.href='/param';
  }
}