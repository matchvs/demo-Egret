class ReconnectView extends egret.DisplayObjectContainer{
    
    private _timer:egret.Timer;
    private _msglabel:eui.Label = new eui.Label();
    private _reconnctTimes:number = 1;
    private _totalTimes:number = 5;

    public _parent:egret.DisplayObjectContainer;
    constructor(par?:egret.DisplayObjectContainer){
        super();
        if(par){
            this._parent = par;
        }else{
            par = this;
        }
        this.initView();
    }


    public initView(){

        GameData.response.errorResponse = this.errorResponse.bind(this);
        let spt = new egret.Sprite();
        spt.graphics.beginFill(0x555555, 0);
        spt.graphics.drawRect( 0, 0, this._parent.width, this._parent.height );
        spt.graphics.endFill();
        this.addChild( spt ); 

        this._msglabel = new eui.Label();
        this._msglabel.text = "正在重新连接......"+this._reconnctTimes+"/"+this._totalTimes;
        this._msglabel.x = this._parent.width*0.4;
        this._msglabel.y = this._parent.height*0.2;
        this._msglabel.size = 22;
        spt.addChild(this._msglabel);

        let cancleBtn = new eui.Button();
        cancleBtn.label = "取消";
        cancleBtn.x = this._parent.width*0.4;
        cancleBtn.y = this._parent.height*0.8;
        cancleBtn.width = this._parent.width*0.2;
        cancleBtn.height = 40;
        cancleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonCancleBtn, this);
        spt.addChild(cancleBtn);

        this._timer = new egret.Timer(1000, 5);
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this._timer.start();

    }

    private timerFunc(event: egret.Event){
        this._msglabel.text = "正在重新连接......"+this._reconnctTimes+"/"+this._totalTimes;
        console.log(this._msglabel.text)
        GameData.response.reconnectResponse = this.reconnectResponse.bind(this);
        GameData.engine.reconnect();
        this._reconnctTimes++;
        if(this._reconnctTimes > this._totalTimes){
            this._timer.stop();
            GameData.response.leaveRoomResponse = this.leaveRoomResponse.bind(this);
            GameData.engine.leaveRoom("");
        }
    }

    private reconnectResponse(status:number, roomUserInfoList:Array<MsRoomUserInfo>, roomInfo:MsRoomInfo){
        this._timer.stop();
        if(status !== 200){
            console.log("重连失败"+this._reconnctTimes);
            this._msglabel.text = "重连失败......"+this._reconnctTimes+"/"+this._totalTimes;
            //GameData.engine.leaveRoom("");
            GameSceneView._gameScene.lobby();
        }else{
            console.log("重连成功status:"+status+" 重连次数："+this._reconnctTimes);
            //房主判断
            let userIds = [GameData.userInfo.id];
            roomUserInfoList.forEach(function(value){
                 console.log("用户ID："+value.userId);
                if (GameData.userInfo.id !== value.userId) userIds.push(value.userId);
            });
            GameData.playerUserIds = userIds;
            GameData.roomPropertyValue = roomInfo.roomProperty;
            GameData.roomID = roomInfo.roomID;
            GameData.isRoomOwner = false;
            if(userIds.length === GameData.maxPlayerNum){
                GameData.response.getRoomDetailResponse = this.getRoomDetailResponse.bind(this);
                GameData.engine.getRoomDetail(GameData.roomID);
            }else{
                //还没有开始游戏
                console.log("还没有开始游戏或者游戏结束, 退出到大厅");
                GameData.engine.leaveRoom("leaveRoom");
                GameSceneView._gameScene.lobby();
            }
        }
    }

    private sendEventResponse(rsp:MsSendEventRsp){
        if(rsp.status === 200){
            var event = GameData.events[rsp.sequence]
            if (event && event.action === GameData.reconnectReadyEvent) {
                delete GameData.events[rsp.sequence];
                GameSceneView._gameScene.play();
            }
        }
    }

    private errorResponse(errCode:number, errMsg:string){
        this._timer.stop();
    }

    private mbuttonCancleBtn(event:egret.TouchEvent){
        this._timer.stop();
        GameData.response.leaveRoomResponse = this.leaveRoomResponse.bind(this);
        GameData.engine.leaveRoom("");
    }

    private leaveRoomResponse(rsp:MsLeaveRoomRsp){
        console.log("取消重新连接，离开房间:"+rsp.status)
        GameSceneView._gameScene.lobby();
    }
    private getRoomDetailResponse(rsp:MsGetRoomDetailRsp){
        console.log("status:"+rsp.status+" 还没有开始游戏或者游戏结束, 退出到大厅：state="+rsp.state);
        if(rsp.status === 200 && rsp.state === 2){
            GameData.response.sendEventResponse = this.sendEventResponse.bind(this);
            let eventTemp = {
                action: GameData.reconnectReadyEvent,
                userID: GameData.userInfo.id
            }
            let result = GameData.engine.sendEvent(JSON.stringify(eventTemp));
            
            if (!result || result.result !== 0) {
                return console.log('重连发送信息失败');
            }
            GameData.events[result.sequence] = eventTemp;
            console.log('重连发送信息成功');
        }else{
            
            GameData.engine.leaveRoom("leaveRoom");
            GameSceneView._gameScene.lobby();
        }
    }
}