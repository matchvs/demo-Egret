class ErrorView extends egret.DisplayObjectContainer{
    private _parent:egret.DisplayObjectContainer;
    
    public ReturnCallback = function(msg:string){
    }

    private _errorMsg:eui.Label;

    public SetErrorMsg(msg:string){
        this._errorMsg.text = msg;
    }

    public constructor(pr:egret.DisplayObjectContainer){
        super();
        this._parent = pr;
        this.initView();
    }
    private initView(){
        //清理定时器
        while(GameData.intervalList.length > 0){
            clearTimeout(GameData.intervalList.pop());
        }

        let spt = new egret.Sprite();
        spt.graphics.beginFill(0x555555, 2);
        spt.graphics.drawRect( 0, 0, this._parent.width, this._parent.height );
        spt.graphics.endFill();
        this.addChild( spt );   

        let errorMsg:eui.Label = new eui.Label();
        errorMsg.textAlign = "center";
        errorMsg.height = 200;
        errorMsg.width = 400;
        errorMsg.horizontalCenter = 0;
        errorMsg.y = this._parent.height*0.1,
        errorMsg.size = 24;
        errorMsg.x = this._parent.width*0.3;
        errorMsg.textColor = 0xff0000;
        //errorMsg.y = 60;
        this._errorMsg = errorMsg;
        spt.addChild(errorMsg);

        let exitBtn:eui.Button = new eui.Button();
        exitBtn.label = "返回";
        exitBtn.width = 400;
        exitBtn.height = 60;
        exitBtn.horizontalCenter = 0;
        exitBtn.x = this._parent.width*0.3;
        exitBtn.y = this._parent.height*0.7;
        exitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonExitRoom, this);
        spt.addChild(exitBtn);

    }

    /**
     * 显示重连按钮
     */
    public showReconnect(){
        let recBtn:eui.Button = new eui.Button();
        recBtn.label = "重新连接";
        recBtn.width = 400;
        recBtn.height = 50;
        recBtn.horizontalCenter = 0;
        recBtn.x = this._parent.width*0.3;
        recBtn.y = this._parent.height*0.8;
        recBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonReconnRoom, this);
        this.addChild(recBtn);
    }

    private mbuttonReconnRoom(event:egret.TouchEvent){
        //重连界面
        GameSceneView._gameScene.reconnectView();
    }
    
    private mbuttonExitRoom(event:egret.TouchEvent){
        this.ReturnCallback("");
    }

}