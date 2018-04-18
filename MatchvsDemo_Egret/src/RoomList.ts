/**
 * 房间列表，这个是调用 createRoom接口创建的房间获取到的房间列表
 */
class RoomListView  extends egret.DisplayObjectContainer{
    // private _roomMebberList:Array<RoomView>;
    private _parent:egret.DisplayObjectContainer;
    private _getRoomListFlter:MsRoomFilter;
    private _messageText:egret.TextField;
    private _timer: egret.Timer

    private _roomList = new Array<RoomView>();

    constructor(pr:egret.DisplayObjectContainer){
         super();
         this._parent = pr;

         this._getRoomListFlter = new MsRoomFilter(GameData.maxPlayerNum,0,0,"");

         this.initView();
    }

    private initView(){
        
        let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = 400;
        colorLabel.textAlign = "center";
        colorLabel.text = "房间列表";
        colorLabel.size = 35;
        colorLabel.x = this._parent.width*0.3;
        colorLabel.y = 60;
        this.addChild(colorLabel);

        let messageText = new egret.TextField();
        messageText.textColor = 0xff0000;
        messageText.width = this._parent.width*0.6;
        messageText.height = this._parent.height*0.2;
        messageText.textAlign = "center";
        messageText.text = "暂时没有房间";
        messageText.visible = false;
        messageText.size = 35;
        messageText.x = this._parent.width*0.2;
        messageText.y = this._parent.height*0.4;
        this._messageText = messageText;
        this.addChild(messageText);

        let exitBtn:eui.Button = new eui.Button();
        exitBtn.label = "返回";
        exitBtn.width = this._parent.width*0.6;
        exitBtn.height = 60;
        exitBtn.x = this._parent.width*0.2;
        exitBtn.y = this._parent.height*0.85;
        exitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonExitRoom, this);
        this.addChild(exitBtn);

        // GameData.response.getRoomListResponse = this.getRoomListResponse.bind(this);
        // GameData.engine.getRoomList(this._getRoomListFlter);

        this.getRoomListEx();

        this._timer = new egret.Timer(300, 0);
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this._timer.start();
        
    }

    private timerFunc(event: egret.Event) {
        this.getRoomListEx();
    }

    /**
     * 获取房间列表 扩展接口，附带更多的返回信息
     */
    private getRoomListEx():void{
        let filter = new MsRoomFilterEx(GameData.createRoomInfo.maxPlayer,
        GameData.createRoomInfo.mode,
        GameData.createRoomInfo.canWatch,
        GameData.createRoomInfo.roomProperty, 0, 1, 0, 0, 0, 3);
        GameData.response.getRoomListExResponse = this.getRoomListExResponse.bind(this);
        GameData.engine.getRoomListEx(filter);
    }

    private mbuttonExitRoom(event:egret.TouchEvent){
        //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
    }

    private addRoomViews(roomCnt:number, roomIDList:Array<string>){
        for(let i = 0; i < roomCnt; i++){
            let room1 = new RoomView();
            room1.name = "room"+i;
            room1.layContents(0,i*(room1.height+10),roomIDList[i], "");
            this.addChild(room1);
        }
    }

    private getRoomListResponse(status:number, roomInfos:Array<MsRoomInfoEx>){
        if( status !== 200){
            this._messageText.text = "获取房间列表错误："+status;
            this._messageText.visible = false;
            return
        }

        if( roomInfos.length === 0){
            this._messageText.text = "暂时没有房间";
            this._messageText.visible = true;
            return;
        }

        for(let i = 0; i < roomInfos.length; i++){
            var room1 = new RoomView();
            room1.name = "room"+i;
            room1.layContents(this._parent.width*0.3,i*(room1.height+5)+120,roomInfos[i].roomID,"");
            this.addChild(room1);
        }
    }

    /**
     * 获取房间信息列表扩展接口，跟getRoomList接口相比 此接口提供更多的房间信息
     */
    private getRoomListExResponse(rsp:MsGetRoomListExRsp){
        if(rsp.status !== 200){
            this._messageText.text = "获取房间列表错误："+status;
            this._messageText.visible = false;
            return
        }

        if(rsp.roomAttrs.length === 0){
            this._messageText.text = "暂时没有房间";
            this._messageText.visible = true;
            return;
        }else{
            this._messageText.visible = false;
        }
        for(let j = 0; j < this._roomList.length; j++){
            if(this.contains(this._roomList[j])){
                this.removeChild(this._roomList[j]);
            }
        }
        this._roomList = [];
        for(let i = 0; i < rsp.roomAttrs.length && i < 3; i++){
            let stateStr:string = rsp.roomAttrs[i].state === 1 ? "开放":"关闭";
            let mapValue:string = rsp.roomAttrs[i].roomProperty === GameData.roomPropertyType.mapA ? "[地图：彩图]":"[地图：灰图]";
            let room1 = new RoomView();
            room1.name = "room";
            room1.layContents(this._parent.width*0.3,
            i*(room1.height+5)+120,
            rsp.roomAttrs[i].roomID,
            "[状态:"+ stateStr + "] [房间人数："+ rsp.roomAttrs[i].gamePlayer +"/"+ rsp.roomAttrs[i].maxPlayer+"] "+ mapValue
            );
            this.addChild(room1);
            this._roomList.push(room1);
        }
    }
}