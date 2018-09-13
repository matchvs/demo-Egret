class ErrorNote extends eui.Component implements  eui.UIComponent {
	
	
	private btn_return:eui.Button;
	private lab_userID:eui.Label;
	private lab_content:eui.Label;

	private btn_reconnect:eui.Label;


	private errMsg:string;

	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
		if("btn_return" == partName){
			this.btn_return = instance;
			this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonExitRoom, this);
		}else if("lab_content" == partName){
			this.lab_content = instance;
		}else if("btn_reconnect" == partName){
			this.btn_reconnect = instance;
			// this.btn_reconnect.visible = false;
			this.btn_reconnect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonReconnRoom, this);
		}
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.lab_userID.text = "用户ID："+GameData.gameUser.id;
		//清理定时器
        while(GameData.intervalList.length > 0){
            clearTimeout(GameData.intervalList.pop());
        }
		this.lab_content.text = this.errMsg;
	}

	public SetErrorMsg(msg:string){
        this.errMsg = msg;
    }

	public showReconnect(){
		this.btn_reconnect.visible = true;
	}

	private mbuttonReconnRoom(event:egret.TouchEvent){
        //重连界面
        GameSceneView._gameScene.reconnectView();
    }
    
    private mbuttonExitRoom(event:egret.TouchEvent){
        GameSceneView._gameScene.login();
    }
	
}