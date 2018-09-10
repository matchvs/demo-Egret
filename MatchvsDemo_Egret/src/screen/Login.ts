class Login extends eui.Component implements  eui.UIComponent {

	private txt_gameID:eui.TextInput;
	private txt_appKey:eui.TextInput;
	private txt_secretKey:eui.TextInput;

	private btn_enter:eui.Button;
	private rect_clear:eui.Rect;
	private lab_clear:eui.Label;


	public constructor() {
		super();
		this.addMsResponseListen();
	}

	private getMyChilds(partName:string,instance:any){
		if("txt_gameID" == partName){
			this.txt_gameID = instance;
		}else if("txt_appKey" == partName){
			this.txt_appKey = instance;
		}else if("txt_secretKey" == partName){
			this.txt_secretKey = instance;
		}else if("btn_enter" == partName){
			this.btn_enter = instance;
			this.btn_enter.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
				console.log(" environment=" + GameData.DEFAULT_ENV + " gameid=" + GameData.gameID);
				let result = mvs.MsEngine.getInstance.init(GameData.CHANNEL, GameData.DEFAULT_ENV, GameData.gameID);
			}, this);
		}else if("rect_clear" == partName){
			this.rect_clear = instance;
			this.rect_clear.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
            	LocalStore_Clear();
        	}, this);
		}else if("lab_clear" == partName){
			this.lab_clear = instance;
			this.lab_clear.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
            	LocalStore_Clear();
        	}, this);
		}
	}

	protected partAdded(partName:string,instance:any):void
	{
		this.getMyChilds(partName,instance);
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.txt_gameID.text = GameData.gameID.toString();
		this.txt_appKey.text = GameData.appkey;
		this.txt_secretKey.text = GameData.secretKey;
	}


	private addMsResponseListen(){
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_INIT_RSP, this.initResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_REGISTERUSER_RSP, this.registerUserResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LOGIN_RSP, this.loginResponse,this);
    }

    private release(){
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_INIT_RSP, this.initResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_REGISTERUSER_RSP, this.registerUserResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LOGIN_RSP, this.loginResponse,this);
    }

    private initResponse(ev:egret.Event) {
        console.log("initResponse,status:" + ev.data.status);
        //获取微信信息
        this.getUserFromWeChat((userInfos)=>{
            //绑定 微信 openID 成功 生成一个 专用 userID 登录
            Login.bindOpenIDWithUserID(userInfos);
        },(res)=>{
            //获取微信信息失败，注册游客身份登录
            console.info("获取信息失败：",res);
            mvs.MsEngine.getInstance.registerUser();
        });
    }

    /**
     * 调用 matchvs 注册接口回调
     */
    private registerUserResponse(ev:egret.Event) {
        let userInfo = ev.data;
        GameData.gameUser.id = userInfo.id;
        GameData.gameUser.name = userInfo.name;
        GameData.gameUser.avatar = userInfo.avatar;
        GameData.gameUser.token = userInfo.token;
        //登录
        if(userInfo.status == 0){
            mvs.MsEngine.getInstance.login(userInfo.id, userInfo.token, GameData.gameID,GameData.appkey, GameData.secretKey);
        }
    }
    /**
     * 调用 matchvs login 接口回调处理
     */
    private loginResponse(ev:egret.Event) {
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LOGIN_RSP, this.loginResponse,this);
        let login = ev.data;
        console.log("loginResponse, status=" + login.status);
        if (login.status != 200) {
            console.log("登陆失败");
        } else {
            console.log("登陆成功 roomID=" + login.roomID);
            if (login.roomID !== "0") {
                GameData.roomID = login.roomID;
                //重新连接
                GameSceneView._gameScene.reconnectView();
            } else {
                GameSceneView._gameScene.lobby();
            }
        }
    }

    /**
     * 获取微信中的用户信息,这个是支持微信用户绑定的，如果使用微信身份登录，将执行绑定操作，如果是游客身份登录将到 matchvs 生成一个游客身份的userID
     */
    private getUserFromWeChat(success:Function, fa:Function){
        //获取微信信息
        try {
            getWxUserInfo({
                success:(userInfos)=>{
                    console.log("获取用户信息成功！");
                    //获取OpenID
                    getUserOpenID({
                        success:function(openInfos){
                            console.info("openInfos:",openInfos);
                            if(openInfos.status == 0){
                                success({userInfo:userInfos, openInfo:openInfos.data});
                                //console.info("userInfo:",userInfos,"openInfo:",openInfos.data);
                            }else{
                                fa("获取OpenID失败！");
                            }
                        },
                        fail:(res)=>{
                            console.info("获取openID 失败！:",res);
                            fa(res);
                        }
                    });
                },
                fail:fa
            });
        } catch (error) {
            console.log("不是在微信平台，调用不进行绑定！");
            fa(error);
        }
    }

    /**
     * 绑定微信OpenID 返回用户信息
     */
    private static bindOpenIDWithUserID(wxUserInfo:any){
        console.log("获取到的微信用户信息",wxUserInfo);
        if(!wxUserInfo){
            return;
        }

        let reqUrl = GameData.getBindOpenIDAddr(GameData.CHANNEL,GameData.DEFAULT_ENV);
        //sign=md5(appKey&gameID=value1&openID=value2&session=value3&thirdFlag=value4&appSecret)
        let params = "gameID="+GameData.gameID+"&openID="+wxUserInfo.openInfo.openid+"&session="+wxUserInfo.openInfo.session_key+"&thirdFlag=1";

        //计算签名
        let signstr = GameData.getSign(params);
        //重组参数
        params = "userID=0&"+params+"&sign="+signstr;
        //用于post请求，不能使用get请求，如果使用get请求可能会出现签名失败，因为微信session_key有需要url编码的字符
        let jsonParam = {
            userID:0,
            gameID:GameData.gameID,
            openID:wxUserInfo.openInfo.openid,
            session:wxUserInfo.openInfo.session_key,
            thirdFlag:1,
            sign:signstr
            };
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(reqUrl,egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(jsonParam);
        request.addEventListener(egret.Event.COMPLETE,(event:egret.Event)=>{
            var request = <egret.HttpRequest>event.currentTarget;
            console.log("bindOpenIDWithUserID get data : ",request.response);
            let repData = JSON.parse(request.response);
            console.log("bindOpenIDWithUserID repData : ",repData);
            //绑定成功
            if( repData.status == 0){
                GameData.gameUser.id = repData.data.userid;
                GameData.gameUser.name = wxUserInfo.userInfo.nickName;
                GameData.gameUser.avatar = wxUserInfo.userInfo.avatarUrl;
                GameData.gameUser.token = repData.data.token;
                //绑定成功就登录
                mvs.MsEngine.getInstance.login(GameData.gameUser.id, GameData.gameUser.token, GameData.gameID,GameData.appkey, GameData.secretKey);
            }
        },this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR,(event:egret.IOErrorEvent)=>{
             console.log("bindOpenIDWithUserID get error : " + event);
        },this);
    }
	
}