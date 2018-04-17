class LoginView extends eui.UILayer{
	private _gameidInput:eui.TextInput;

    private _inputBox_W = 400 ;
    private _inputBox_H = 40 ;
    private _inputBox_Fsize = 24;
    private _inputBox_Fcolor = 0x000000;

    private _environment = GameData.DEFAULT_ENV;

    public constructor() {
        super();
		this.initView();
    }
	private initView():void
	{
        
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

        let gameidInput = new eui.TextInput();
        gameidInput.prompt = "200757";
        gameidInput.text = "200757";
        gameidInput.horizontalCenter = 0;
        gameidInput.width = this._inputBox_W;
        gameidInput.height = this._inputBox_H;
        gameidInput.verticalCenter = -150;
        gameidInput.textColor = this._inputBox_Fcolor;
		this._gameidInput = gameidInput;
        this.addChild(this._gameidInput);

        let appkeyInput = new eui.TextInput();
        appkeyInput.prompt = "6783e7d174ef41b98a91957c561cf305";
        appkeyInput.width = this._inputBox_W;
        appkeyInput.height = this._inputBox_H;
        appkeyInput.textColor = this._inputBox_Fcolor;
        appkeyInput.horizontalCenter = 0;
        appkeyInput.verticalCenter = -100
        this.addChild(appkeyInput);

        let appSecretInput = new eui.TextInput();
        appSecretInput.prompt = "da47754579fa47e4affab5785451622c";
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
        button.verticalCenter = 0+50;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        let clearCachebtn = new eui.Button();
        clearCachebtn.label = "清除缓存";
        clearCachebtn.width = 300;
        clearCachebtn.horizontalCenter = 0;
        clearCachebtn.verticalCenter = 0+120;
        this.addChild(clearCachebtn);
        clearCachebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, (event:egret.TouchEvent)=>{
            LocalStore_Clear();
        }, this);

        var cbx = new eui.CheckBox();
        cbx.label = "启用调试环境";
        cbx.horizontalCenter = 0;
        cbx.verticalCenter = 0;
        cbx.height = 20;
        if(this._environment === GameData.ENVIRONMENT.dev)cbx.selected = true;
        this.addChild(cbx);
        cbx.addEventListener(eui.UIEvent.CHANGE,(evt:eui.UIEvent)=>{
            if(evt.target.selected){
                this._environment = GameData.ENVIRONMENT.dev;//alpha开发环境
            }else{
                this._environment = GameData.ENVIRONMENT.pro;//release正式环境
            }
        },this
        );
	}

    private onButtonClick(e: egret.TouchEvent) {
		GameData.response.initResponse = this.initResponse.bind(this);
        GameData.gameID = Number(this._gameidInput.text);
        console.log(" environment="+ this._environment + " gameid="+ GameData.gameID);
        let result = GameData.engine.init(GameData.response, GameData.CHANNEL, this._environment, GameData.gameID);
        console.log("mvs.init result:" + result);
	}

	private initResponse(status:number) {
		console.log("initResponse,status:" + status);
		GameData.response.registerUserResponse = this.registerUserResponse.bind(this);
        var result = GameData.engine.registerUser();
        if (result !== 0) {
			console.log('注册用户失败，错误码:' + result);
		} else {
			console.log('注册用户成功');
		}
	}

	private registerUserResponse(userInfo:MsRegistRsp) {
		console.log("registerUserResponse:" + JSON.stringify(userInfo));
		GameData.userInfo = userInfo;
		var deviceId = 'abcdef';
		var gatewayId = 0;
		console.log("开始登陆,用户Id:" + userInfo.id);
		GameData.response.loginResponse = this.loginResponse.bind(this);
		var result = GameData.engine.login(userInfo.id, userInfo.token,
            200757, 1,
            "6783e7d174ef41b98a91957c561cf305", "da47754579fa47e4affab5785451622c",
            deviceId, gatewayId);
		if (result !== 0) {
			console.log("登陆失败,result:" + result);
		}
	}

	private loginResponse(login:MsLoginRsp) {
		console.log("loginResponse, status=" + login.status);
		if (login.status != 200) {
			console.log("登陆失败");
		} else {
			console.log("登陆成功");
			GameSceneView._gameScene.lobby();
		}
	}
}
