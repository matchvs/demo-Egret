var wxShareConf = {
    getOpenIDAddr:"https://test79open.matchvs.com/getOpenID?" //传入code获取微信openID的服务端地址
}

/**
 * 获取启动参数
 */
function getLaunchOptionsSync() {
    var LaunchOption = wx.getLaunchOptionsSync();
    console.log("LaunchOption:" + JSON.stringify(LaunchOption));
    console.log("LaunchOption quary:" + JSON.stringify(LaunchOption.query));
    return LaunchOption;
}

/**
 * 约战API
 * @param {string} title 
 * @param {string} query getLaunchOptionsSync 中的参数
 */
function together(title, query) {
    wx.shareAppMessage({
        title: title,
        query: query,
        complete: function () {
            console.log(arguments);
        },
        success: function (shareTickets, groupMsgInfos) {
            console.log(shareTickets);
            console.log(groupMsgInfos);
        }
    })

    wx.updateShareMenu({
        withShareTicket: true,//开启群发
        success: function () {
            console.log("updateShareMenu success");
        },
        fail: function (e) {
            console.log("updateShareMenu fail" + e);
        }
    });


}

/**
 * 获取用户信息
 * @param {object} obj {success:Function, fail:Function}
 */
function getWxUserInfo(obj) {
	var callObj = obj;
    wx.getUserInfo({
        openIdList: ['selfOpenId'],
        lang: 'zh_CN',
        success: function (res) {
            console.log('success', res.userInfo);
            return callObj.success(res.userInfo);
        },
        fail: function (res) {
            console.log("fail", res);
            return callObj.fail(res);
        }});

}


/**
 * 获取用户OpenID
 * @param {object} obj {success:function(res),fail:function(res)}
 */
function getUserOpenID(obj) {
    var callObj = obj;
	if( typeof(wx) == "undefined"){
		return;
	}
    wx.login({
        success: function (res) {
            var wcode = res.code;
            wx.request({
                url: wxShareConf.getOpenIDAddr,
                method: "GET",
                data: {
                    code: wcode
                },
                success: function (res) {
                    if (callObj.success) {
                        callObj.success(res.data);
                    }
                },
                fail:function(res){
                    console.info("getOpenID failed url:",wxShareConf.getOpenIDAddr);
                    if (callObj.fail) {
                        callObj.fail(res);
                    }
                }
            });
        },
        fail: function (res) {
            console.log("get code failed:",res);
            if (callObj.fail) {
                callObj.fail(res);
            }
        },
    });
}



window.getLaunchOptionsSync = getLaunchOptionsSync;
window.together = together;
window.getWxUserInfo = getWxUserInfo;
window.getUserOpenID = getUserOpenID;