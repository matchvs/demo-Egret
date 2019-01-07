class PremiseLoginUI extends eui.Component implements  eui.UIComponent {
	
	private txt_endport:eui.TextInput;
	private txt_gameID:eui.TextInput;
	private txt_appKey:eui.TextInput;
	private txt_secretKey:eui.TextInput;
	private txt_userID:eui.TextInput;
	private txt_token:eui.TextInput;

	private btn_login:eui.Button;
	private btn_return:eui.Button;
	
	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
		this.getControl(partName,instance);
	}

	private getControl(partName:string,instance:any){
		if("txt_endport" === partName){
			this.txt_endport = instance;
			this.txt_endport.addEventListener(egret.Event.CHANGE, (event: egret.Event)=>{
				let textInput:eui.TextInput = event.target;
				if(!/^[A-Za-z0-9//.:]+$/.test(textInput.text)){
					textInput.text = "";
				}
			},this);
		}else if("txt_gameID" === partName){
			this.txt_gameID = instance;
			this.txt_gameID.addEventListener(egret.Event.CHANGE, (event: egret.Event)=>{
				let textInput:eui.TextInput = event.target;
				if(!/^[0-9]+$/.test(textInput.text)){
					textInput.text = "";
				}
			},this);
		}else if("txt_appKey" === partName){
			this.txt_appKey = instance;
			this.txt_appKey.addEventListener(egret.Event.CHANGE, (event: egret.Event)=>{
				let textInput:eui.TextInput = event.target;
				if(!/^[A-Za-z0-9]+$/.test(textInput.text)){
					textInput.text = "";
				}
			},this);
		}else if("txt_secretKey" === partName){
			this.txt_secretKey = instance;
			this.txt_secretKey.addEventListener(egret.Event.CHANGE, (event: egret.Event)=>{
				let textInput:eui.TextInput = event.target;
				if(!/^[A-Za-z0-9]+$/.test(textInput.text)){
					textInput.text = "";
				}
			},this);
		}else if("txt_userID" === partName){
			this.txt_userID = instance;
			this.txt_userID.addEventListener(egret.Event.CHANGE, (event: egret.Event)=>{
				let textInput:eui.TextInput = event.target;
				if(!/^[0-9]+$/.test(textInput.text)){
					textInput.text = "";
				}
			},this);
		}else if("txt_token" === partName){
			this.txt_token = instance;
			this.txt_token.addEventListener(egret.Event.CHANGE, (event: egret.Event)=>{
				let textInput:eui.TextInput = event.target;
				if(!/^[A-Za-z0-9]+$/.test(textInput.text)){
					textInput.text = "";
				}
			},this);
		}else if("btn_login"=== partName){
			this.btn_login = instance;
			this.btn_login.addEventListener(egret.TouchEvent.TOUCH_TAP, this.premiseInit, this);
		}else if("btn_return"=== partName){
			this.btn_return = instance;
			this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnReturn, this);
		}
	}

	protected childrenCreated():void
	{
		super.childrenCreated();
		this.addMsResponseListen();
		this.setDefaultValue();
	}

	private setDefaultValue(){
		this.txt_token.text = "OEWIURIOJNUOGIUDSF809LJOKETGT89H";
		this.txt_secretKey.text = "appsecret01";
		this.txt_userID.text = "123456";
		this.txt_appKey.text = "appkey01";
		this.txt_gameID.text = "1";
		this.txt_endport.text = "aligateway.matchvs.com";
	}

	private addMsResponseListen(){
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_INIT_RSP, this.initResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LOGIN_RSP, this.loginResponse,this);
    }

    private release(){
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_INIT_RSP, this.initResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LOGIN_RSP, this.loginResponse,this);
    }

	/**
	 * 初始化
	 */
	private premiseInit(event:egret.TouchEvent){
		let endPoint:string = this.txt_endport.text;
		let appkey:string = this.txt_appKey.text;
		let gameID:number = Number(this.txt_gameID.text);
		mvs.MsEngine.getInstance.premiseInit(endPoint, gameID, appkey);
	}

	/**
	 * 初始化返回
	 */
	private initResponse(event:egret.Event){
		let userID:number = Number(this.txt_userID.text);
		let token:string = this.txt_token.text;
		let gameID:number = Number(this.txt_gameID.text);
		let secretkey:string = this.txt_secretKey.text;
		GameData.gameUser.id = userID;
		GameData.gameUser.token = token;
		/**
		 * 调用 matchvs 登录接口
		 */
		mvs.MsEngine.getInstance.login(userID,token);
	}

	/**
	 * 登录回调接口
	 */
	private loginResponse(event:egret.Event){
		let login = event.data;
        console.log("loginResponse, status=" + login.status);
        if (login.status != 200) {
            console.log("登陆失败");
        } else {
			this.release()
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
	 * 返回
	 */
	private btnReturn(e:egret.TouchEvent){
		this.release();
		GameSceneView._gameScene.login();
	}
}