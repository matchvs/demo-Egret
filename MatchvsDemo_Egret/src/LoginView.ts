class LoginView extends eui.UILayer {
    private _gameidInput: eui.TextInput;

    private _inputBox_W = 400;
    private _inputBox_H = 40;
    private _inputBox_Fsize = 24;
    private _inputBox_Fcolor = 0x000000;

    public constructor() {
        super();
        this.initView();
    }

    private initView(): void {
        this.addMsResponseListen();
        let colorLabel = new eui.Label();
        colorLabel.textColor = 0xffffff;
        colorLabel.fontFamily = "Tahoma";  //设置字体
        colorLabel.text = "MatchVSDemo-Egret";
        colorLabel.textAlign = "center";//设置水平对齐方式
        colorLabel.width = 400;
        colorLabel.size = 35;
        colorLabel.horizontalCenter = 0;
        colorLabel.verticalCenter = -250;
        this.addChild(colorLabel);

        var input = new eui.TextInput();
        input.text = GameData.CHANNEL;
        input.prompt = input.text;
        input.horizontalCenter = 0;
        input.width = this._inputBox_W;
        input.height = this._inputBox_H;
        input.verticalCenter = -200;
        input.textColor = this._inputBox_Fcolor;
        this.addChild(input);

        let gameidInput = new eui.TextInput();
        gameidInput.prompt = GameData.gameID + "";
        gameidInput.text = GameData.gameID + "";
        gameidInput.horizontalCenter = 0;
        gameidInput.width = this._inputBox_W;
        gameidInput.height = this._inputBox_H;
        gameidInput.verticalCenter = -150;
        gameidInput.textColor = this._inputBox_Fcolor;
        this._gameidInput = gameidInput;
        this.addChild(this._gameidInput);

        let appkeyInput = new eui.TextInput();
        appkeyInput.prompt = GameData.appkey;
        appkeyInput.width = this._inputBox_W;
        appkeyInput.height = this._inputBox_H;
        appkeyInput.textColor = this._inputBox_Fcolor;
        appkeyInput.horizontalCenter = 0;
        appkeyInput.verticalCenter = -100
        this.addChild(appkeyInput);

        let appSecretInput = new eui.TextInput();
        appSecretInput.prompt = GameData.secretKey;
        appSecretInput.width = this._inputBox_W;
        appSecretInput.height = this._inputBox_H;
        appSecretInput.textColor = this._inputBox_Fcolor;
        appSecretInput.horizontalCenter = 0;
        appSecretInput.verticalCenter = -50;
        this.addChild(appSecretInput);

        let button = new eui.Button();
        button.label = "确定";
        button.width = 300;
        button.horizontalCenter = 0;
        button.verticalCenter = 0 + 50;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, e => {
            GameData.configEnvir(input.text, cbx.selected);
            console.log(" environment=" + GameData.DEFAULT_ENV + " gameid=" + GameData.gameID);
            let result = mvs.MsEngine.getInstance.init(GameData.CHANNEL, GameData.DEFAULT_ENV, GameData.gameID);
        }, this);

        let clearCachebtn = new eui.Button();
        clearCachebtn.label = "清除缓存";
        clearCachebtn.width = 300;
        clearCachebtn.horizontalCenter = 0;
        clearCachebtn.verticalCenter = 0 + 120;
        this.addChild(clearCachebtn);
        clearCachebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
            LocalStore_Clear();
        }, this);

        var cbx = new eui.CheckBox();
        cbx.label = "启用调试环境";
        cbx.horizontalCenter = 0;
        cbx.verticalCenter = 0;
        cbx.height = 20;
        cbx.selected = true;
        this.addChild(cbx);
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
            LoginView.bindOpenIDWithUserID(userInfos);
        },(res)=>{
            //获取微信信息失败，注册游客身份登录
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
    private getUserFromWeChat(success:Function, fail:Function){
        //获取微信信息
        try {
            getWxUserInfo({
                success:(userInfos)=>{
                    //获取OpenID
                    getUserOpenID({
                        success:function(openInfos){
                            if(openInfos.status == 0){
                                success({userInfo:userInfos, openInfo:openInfos.data});
                                //console.info("userInfo:",userInfos,"openInfo:",openInfos.data);
                            }else{
                                fail("获取OpenID失败！");
                            }
                        },
                        fail:fail
                    });
                },
                fail:fail
            });
        } catch (error) {
            console.log("不是在微信平台，调用不进行绑定！");
            fail(error);
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
