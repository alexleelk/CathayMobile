//全局变量
//var SRVIP = "https://b2e.cathaylife.cn";
//var SRVIP = "http://10.20.35.1";
//var SRVIP = "http://10.20.250.111:7080";
var SRVIP = "http://10.20.250.240:7080";
//var SRVIP = "http://10.20.250.154:7080";

//设定jqm可以跨域访问
$( document ).bind( "mobileinit", function() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});

function login(){
    $.mobile.loading('show');

    //记录用户名和密码
    if ($("[name='IS_REM']:checked").size() == 1) {
        $.xcookie("userID", $("#emp_no").val());
        $.xcookie("passWD", $("#password").val());
    } else {
        $.xcookie("userID", "");
        $.xcookie("passWD", "");
    }

    //放置一个cookies表示当前登录的系统为移动展业，避免session timeout的时候跳转到B2E首页
    $.xcookie("CathayMobile", "CathayMobile");

    var s = new Date();
    $.ajax({
        url: SRVIP + "/servlet/HttpDispatcher/loginZM/input?sys=1&rd=" + s.toLocaleTimeString(),
        dataType: "json",
        data: {"userID":$('#emp_no').val(),"passWD":$('#password').val()},
        type: "get",
        success: function(data){
            $.mobile.loading('hide');
            if(data.ReturnCode!=0){
                $('#loginmsg').html(data.MsgDesc);
                $("#popupmsg").popup('open');
            }else{
                //alert('login successful! and now goto ' + SRVIP + '/servlet/HttpDispatcher/ATQ0_0020/init');
                $("#indexpage").remove();
                $("#navpage1").remove();
                $("#navpage2").remove();
                $("#navpage3").remove();
                $("#navpage4").remove();
                loadPage('/servlet/HttpDispatcher/ATQ0_0020/init');
            }
        },
        error: function(){
            $.mobile.loading('hide');
            $('#loginmsg').html("\u767b\u9646\u9519\u8bef\uff0c\u65e0\u6cd5\u8fde\u63a5\u5230\u767b\u5f55\u670d\u52a1\u5668\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u662f\u5426\u53ef\u7528\u3002");//登陆错误，无法连接到登录服务器，请检查网络是否可用。
            $("#popupmsg").popup('open');
        }
    })
}

function loadPage(link) {
    $.mobile.loading('show');
    $.ajax({
        url: SRVIP + link,
        type: 'get',
        dataType: 'html',
        cache: 'false',
        success: function(htmlstr) {
            $.mobile.loading('hide');
            $('body').append(htmlstr);
            $.mobile.changePage($('#indexpage'));
        },
        error: function() {
            $.mobile.loading('hide');
            $('#loginmsg').html("\u8f7d\u5165\u9996\u9875\u9519\u8bef\uff0c\u65e0\u6cd5\u8fde\u63a5\u5230\u670d\u52a1\u5668\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u662f\u5426\u53ef\u7528\uff0c\u6216\u8005\u54a8\u8be21399\u3002");//载入首页错误，无法连接到服务器，请检查网络是否可用，或者咨询1399。
            $("#popupmsg").popup('open');
        }
    });
}