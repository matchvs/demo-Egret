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
        spt.addChild(cancleBtn);

        this._timer = new egret.Timer(1000, 5);
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this._timer.start();

    }

    private timerFunc(event: egret.Event){
        this._msglabel.text = "正在重新连接......"+this._reconnctTimes+"/"+this._totalTimes;
        GameData.response.reconnectResponse = this.reconnectResponse.bind(this);
        GameData.engine.reconnect();
        this._reconnctTimes = this._reconnctTimes > this._totalTimes ? this._totalTimes: this._reconnctTimes++;
    }

    private reconnectResponse(status:number, roomUserInfoList:Array<MsRoomUserInfo>, roomInfo:MsRoomInfo){
        if(status !== 200){
            console.log("重连失败"+this._reconnctTimes);
            this._msglabel.text = "重连失败......"+this._reconnctTimes+"/"+this._totalTimes;
            if(this._reconnctTimes > this._totalTimes){

            }
        }else{
            //房主判断
            let userIds = [GameData.userInfo.id];
            roomUserInfoList.forEach(function(value){
                if (GameData.userInfo.id !== value.userId) userIds.push(value.userId)
            });
            GameData.playerUserIds = userIds;
            GameData.roomPropertyValue = roomInfo.roomProperty;
            GameData.roomID = roomInfo.roomID;
            if(userIds.length === GameData.maxPlayerNum){
                //GameSceneView._gameScene.play();
                GameData.response.sendEventNotify = this.sendEventNotify.bind(this);
            }else{
                //还没有开始游戏
            }
        }
    }

    private sendEventNotify(eventInfo:MsSendEventNotify){
        if (eventInfo
            && eventInfo.cpProto
            && eventInfo.cpProto.indexOf(GameData.gameStartEvent) >= 0) {
            GameSceneView._gameScene.play();
        }
    }
}