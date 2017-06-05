
var limit = 3;
var pages = 0;
var page = 1;
var renderData =[];
$(function(){
    $("#messageBtn").on('click',function(){
        $.ajax({
            url:"/api/comment/post",
            method:'post',
            data:{
                contentid:$("#contentId").val(),
                content:$("#messageContent").val()
            },
            success:function(responseData){
                // console.log(data);
                $("#messageContent").val('');
                renderData = responseData.data.comments.reverse();
                renderComment()
            }
        })
    });
    $.ajax({
        url:"/api/comment",
        data:{
            contentid:$("#contentId").val()
        },
        success:function(responseData){
            $("#messageContent").val('');
            renderData = responseData.data.reverse();
            renderComment();
        }
    });

    $(".pager").delegate('a','click',function(){
        if($(this).parent().hasClass('previous')){
            page--;
        }else{
            page++;
        }
        renderComment();
    });
});

function renderComment(){
    pages = Math.ceil(renderData.length/limit);
    pages = Math.max(pages,1);
    page =Math.max(page,1);
    page =Math.min(page,pages);

    if(page<= 1){
        page = 1;
        $(".previous a").text('没有上一页');
    }else{
        $(".previous a").text('上一页');
    }
    if(page>=pages){
        page = pages;
        $(".next a").text('没有下一页');
    }else{
        $(".next a").text('下一页');
    }

    $(".sumPage").text(pages);
    $(".pageNow").text(page);

    var start=(page-1)*limit;
    var end = start + limit;

    $(".messageCount").html(renderData.length);
    var html = '';
    for(var i=start;i<end;i++){

        html+='<div class="messagebox">'+
                  '<p><span>'+renderData[i].username+'</span><span>'+formatTime(renderData[i].postTime)+'</span></p>'+
                   '<p>'+renderData[i].content+'</p>'+
                '</div>';
    }
    $(".messageList").html(html);
}

function formatTime(d){
    var date = new Date(d);
    // return date;
   console.log(date);
    return date.getFullYear() +"年"+ date.getMonth() + "月"+date.getDay() + "日"+date.getHours() + ":"+date.getMinutes() +":"+ date.getSeconds();
}
