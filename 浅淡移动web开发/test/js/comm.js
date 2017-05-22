need("biz.login",function(LoginManager){
    LoginManager.init();
    LoginManager.checkLogin(function(){
        g("userinfo").innerHTML = LoginManager.getUin();
        //g("login_nickname_span").innerHTML = LoginManager.getNickName();
        if (isDom(g("logined"))){
            g("logined").style.display = "block";
        }
        if (isDom(g("unlogin"))){
            g("unlogin").style.display = "none";
        }
    });

});
amsCfg_68903 = {
    "iActivityId": 8418, //活动id	
    "iFlowId":    68903, //流程id
    "fFlowSubmitEnd": function(res){
        if(res.sOutValue - res.sOutValue2 > 0){
            document.getElementById('city_zan').style.display = "none"; 
            document.getElementById('city_lottery').style.display = "block";  
        }else{
            document.getElementById('city_zan').style.display = "block"; 
            document.getElementById('city_lottery').style.display = "none";  
        }
        return;
    }           
};
if(g('selectedCity').innerHTML == '北京市'){
    need(["biz/loginManager"],function(loginManager){
        loginManager.checkLogin(function(){
            amsSubmit(8418,68903);    
        })		
    });
}
amsCfg_68682 = {
	'iAMSActivityId' : '8418', // AMS活动号
	'activityId' : '102485', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
        if(callbackObj.iRet == 600){
            document.getElementById('city_zan').style.display = "block"; 
            document.getElementById('city_lottery').style.display = "none";
        }
		alert(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		if(!callbackObj.sPackageName){
            document.getElementById('city_zan').style.display = "block"; 
            document.getElementById('city_lottery').style.display = "none";
			alert(callbackObj.sMsg);
			return;
		}
		//1：实物
		var str = "您获得了 " + callbackObj.sPackageName + " !";
		if(callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood"){
			document.getElementById('content').innerHTML = str;
            amsInit(8418,68683);
			return;
		}
	}
};
amsCfg_68683 = {
	'iAMSActivityId' : '8418', // AMS活动号
	'activityId' : '102485', // 模块实例号
	'contentId' : 'personalID', //弹出层容器
	'buttonId' : 'personInfoContentBtn_68683', //提交按钮
    'fFlowSubmitEnd' : function(callbackObj){
        if(callbackObj.iRet == 0){
            alert(callbackObj.sMsg);
            amsSubmit(8418,68903);
        }else{
            alert(callbackObj.sMsg);
        }
    } //必须传(成功后会把成功的信息返回给这个函数，这个函数处理由模块自己完成)

};

g('city_lottery').addEventListener("touchstart",function(){
    amsSubmit(8418,68682);
},false);
function city(){
    need(["biz/loginManager"],function(loginManager){
        loginManager.checkLogin(function(){
            var url = "http://mapps.game.qq.com/lian/a20140416City/City.php?t="+ new Date().getTime();
            include(url, function(){
                if (typeof(City_JSON) == 'undefined' || !City_JSON){return;}
                if(City_JSON.ret_code == 0){
                    document.getElementById('city_zan').style.display = "none"; 
                    document.getElementById('city_lottery').style.display = "block";       
                }
            })    
        },function(){
            loginManager.login();
        })		
    });	
}/*  |xGv00|5fa292cfd09ca051e1eaf03d2c793244 */