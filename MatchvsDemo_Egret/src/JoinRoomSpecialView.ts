/**
 * 输入房间号加入指定房间
 */
class JoinRoomSpecialView extends eui.Group{
    private _parent:egret.DisplayObjectContainer;

    private _inputBox_W = 400 ;
    private _inputBox_H = 40 ;
    private _inputBox_Fsize = 24;
    private _inputBox_Fcolor = 0x000000;

    private _roomIDInput:eui.TextInput;


    constructor(pr ? : egret.DisplayObjectContainer){
        super();
        if(pr){
            this._parent = pr;
        }else{
            pr = this;
        }
        
        this.initView();
    }

    /**
     * 
     */
    private initView(){

        let myGroup = new eui.Group();
        myGroup.x = this._parent.x;
        myGroup.y = this._parent.y;
        myGroup.width = this._parent.width;
        myGroup.height = this._parent.height/2;
        this.addChild(myGroup);

        let roomIDInput = new eui.TextInput();
        roomIDInput.skinName = "resource/eui_skins/TextInputSkin.exml";
        roomIDInput.prompt = "请输入房间号";
        roomIDInput.width = this._inputBox_W;
        roomIDInput.height = this._inputBox_H;
        roomIDInput.textColor = this._inputBox_Fcolor;
        roomIDInput.horizontalCenter = 0;
        roomIDInput.verticalCenter = -50;
        this._roomIDInput = roomIDInput;
        myGroup.addChild(this._roomIDInput);


        //创建进入房间按钮
        let enterRoomBtn:eui.Button = new eui.Button();
        enterRoomBtn.label = "开始进入房间匹配";
        enterRoomBtn.width = 400;
        enterRoomBtn.height = 60;
        enterRoomBtn.horizontalCenter = 0;
        enterRoomBtn.verticalCenter = 50;
        enterRoomBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonEnterRoom, this);
        myGroup.addChild(enterRoomBtn);

        let exitBtn:eui.Button = new eui.Button();
        exitBtn.label = "返回";
        exitBtn.width = 400;
        exitBtn.height = 60;
        exitBtn.horizontalCenter = 0;
        exitBtn.verticalCenter = 130;
        exitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonExitRoom, this);
        myGroup.addChild(exitBtn);

    }

    /**
     * 
     */
    private mbuttonEnterRoom(event:egret.TouchEvent){

        var str:string  = this._roomIDInput.text;
        //var reg = new RegExp("/^[0-9]+$/")
        if (!/^[0-9]+$/.test(str)){
            console.log("请求输入有效的房间号")
            return
        }
        let info = {name:GameData.gameUser.name,avatar:GameData.gameUser.avatar};
		let infostr = JSON.stringify(info);
        GameSceneView._gameScene.createRoom(this._roomIDInput.text, infostr);
    }

    // private errorResponse(errCode:number, errMsg:string){
    //     console.log("错误回调：errCode=" + errCode + " errMsg="+errMsg);
    //     let errorView = new ErrorView(this);
    //     errorView.SetErrorMsg("错误回调：errCode=" + errCode + " errMsg="+errMsg);
    //     errorView.ReturnCallback = ()=>{
    //         GameSceneView._gameScene.lobby();
    //     };
    //     return
    // }

    private mbuttonExitRoom(event:egret.TouchEvent){
        //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
    }
}