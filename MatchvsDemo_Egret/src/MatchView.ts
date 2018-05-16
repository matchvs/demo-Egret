class MatchView extends eui.UILayer {
    private _roomID: egret.TextField;
    private _player0: egret.TextField;
    private _player1: egret.TextField;
    private _player2: egret.TextField;
    private _isInRoom: boolean = false;
    public constructor(tags?: any) {
        super();
        this.initView(tags);
        this._isInRoom = false;
        Toast.initRes(this, "resource/loading/toast-bg.png");
    }
    private initView(tags?: any): void {
        //使用地图A
        GameData.roomPropertyValue = GameData.roomPropertyType.mapA;
        let roomIdLabel = new egret.TextField();
        roomIdLabel.textColor = 0xffffff;
        roomIdLabel.width = 400;
        roomIdLabel.textAlign = "center";
        roomIdLabel.text = "正在加载...";
        roomIdLabel.size = 24;
        roomIdLabel.x = 172;
        roomIdLabel.y = 80;
        this._roomID = roomIdLabel;
        this.addChild(this._roomID);

        let player0 = new egret.TextField();
        player0.textColor = 0xffffff;
        player0.width = 400;
        player0.textAlign = "center";
        player0.text = "";
        player0.size = 24;
        player0.x = 172;
        player0.y = 100;
        this._player0 = player0;
        this.addChild(this._player0);

        let player1 = new egret.TextField();
        player1.textColor = 0xffffff;
        player1.width = 400;
        player1.textAlign = "center";
        player1.text = "";
        player1.size = 24;
        player1.x = 172;
        player1.y = 120;
        this._player1 = player1;
        this.addChild(this._player1);

        let player2 = new egret.TextField();
        player2.textColor = 0xffffff;
        player2.width = 400;
        player2.textAlign = "center";
        player2.text = "";
        player2.size = 24;
        player2.x = 172;
        player2.y = 140;
        this._player2 = player2;
        this.addChild(this._player2);

        let exitRoom = new eui.Button();
        exitRoom.label = "退出";
        exitRoom.x = 500;
        exitRoom.y = 460;
        exitRoom.width = 240;
        exitRoom.height = 60;
        this.addChild(exitRoom);
        exitRoom.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonLeaveRoom, this);

        GameData.response.leaveRoomResponse = this.leaveRoomResponse.bind(this);
        GameData.response.leaveRoomNotify = this.leaveRoomNotify.bind(this);
        GameData.response.joinOverNotify = this.joinOverNotify.bind(this);

        if (GameData.matchType == GameData.randomMatch) {
            GameData.response.joinRoomResponse = this.joinRoomResponse.bind(this);
            GameData.response.joinRoomNotify = this.joinRoomNotify.bind(this);
            GameData.engine.joinRandomRoom(GameData.maxPlayerNum, '');
        } else if (GameData.matchType == GameData.tagsMatch && tags) {
            GameData.response.joinRoomResponse = this.joinRoomResponse.bind(this);
            GameData.response.joinRoomNotify = this.joinRoomNotify.bind(this);
            //tags {"match1":"12","match2":"match2"} object of key-value 
            let matchinfo: MsMatchInfo = new MsMatchInfo(GameData.maxPlayerNum, 1, 1, tags);
            GameData.engine.joinRoomWithProperties(matchinfo, "tagsMatch");
        }


        var checkbox = new eui.CheckBox();
        checkbox.label = "允许加入";
        checkbox.addEventListener(egret.Event.CHANGE, e => {
            checkbox.label = checkbox.selected ? "允许加入" : "不允许加入";
            checkbox.selected ? GameData.engine.joinOpen("x") : GameData.engine.joinOver("x");
        }, this);
        checkbox.x = 50;
        checkbox.y = 50;
        this.addChild(checkbox);

        GameData.response.joinOpenNotify = function (d) {
            Toast.show(d.userID + " 设置了允许房间加人");
            checkbox.selected = true;
        }
        GameData.response.joinOpenResponse = function (d) {
            Toast.show(" 设置允许房间加人 " + (d.status == 200 ? "success" : "fail"));
            checkbox.selected = ((d.status == 200)?true:checkbox.selected);
        }
        GameData.response.joinOverNotify = function (d) {
            Toast.show(d.srcUserID + " 设置了不允许房间加人");
            checkbox.selected = false;
        }
        GameData.response.joinOverResponse = function (d) {
            Toast.show(" 设置不允许房间加人 " + (d.status == 200 ? "success" : "fail"));
            checkbox.selected = ((d.status == 200)?false:checkbox.selected);
        }
    }

    /**
     * 退出房间
     */
    private mbuttonLeaveRoom(event: egret.TouchEvent) {
        //如果没有进入房间成功就直接返回游戏大厅界面
        if (this._isInRoom) {
            GameData.engine.leaveRoom("leaveRoom");
        } else {
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
        }

    }


    private leaveRoomNotify(leaveRoomInfo: MsLeaveRoomNotify) {
        if (this._player0.text === leaveRoomInfo.userId.toString()) {
            this._player0.text = '';
        } else if (this._player1.text === leaveRoomInfo.userId.toString()) {
            this._player1.text = '';
        } else if (this._player2.text === leaveRoomInfo.userId.toString()) {
            this._player2.text = '';
        }
    }

    private leaveRoomResponse(rsp: MsLeaveRoomRsp) {
        if (rsp.status !== 200) {
            console.log("退出房间失败！status=" + rsp.status);
        } else {
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
        }
    }



    private joinRoomResponse(status: number, roomuserInfoList: Array<MsRoomUserInfo>, roomInfo: MsRoomInfo) {
        if (status !== 200) {
            console.log("joinRoomResponse,status:" + status);
            return;
        }
        this._roomID.text = "房间号:" + roomInfo.roomID;
        this._isInRoom = true;

        GameData.roomID = roomInfo.roomID;
        var userIds = [GameData.userInfo.id]
        this._player0.text = GameData.userInfo.id.toString();
        var self = this;
        roomuserInfoList.forEach(function (item) {
            if (item.userId === GameData.userInfo.id) {
            } else if (self._player1.text === '') {
                self._player1.text = item.userId.toString();
            } else if (self._player2.text === '') {
                self._player2.text = item.userId.toString();
            }
            if (GameData.userInfo.id !== item.userId) userIds.push(item.userId)
        });
        console.log('房间用户: ' + userIds);
        GameData.response.sendEventNotify = this.sendEventNotify.bind(this); // 设置事件接收的回调

        if (userIds.length >= GameData.maxPlayerNum) {
            GameData.response.joinOverResponse = this.joinOverResponse.bind(this); // 关闭房间之后的回调
            var result = GameData.engine.joinOver("");
            console.log("发出关闭房间的通知");
            if (result !== 0) {
                console.log("关闭房间失败，错误码：", result);
                return;
            }
            GameData.playerUserIds = userIds;
        }
    }

    private joinRoomNotify(roomUserInfo: MsRoomUserInfo) {
        if (this._player0.text === '') {
            this._player0.text = roomUserInfo.userId.toString();
        } else if (this._player1.text === '') {
            this._player1.text = roomUserInfo.userId.toString();
        } else if (this._player2.text === '') {
            this._player2.text = roomUserInfo.userId.toString();
        }
    }

    private joinOverResponse(rsp: MsJoinOverRsp) {
        if (rsp.status === 200) {
            console.log("关闭房间成功");
            this.notifyGameStart();
        } else {
            console.log("关闭房间失败，回调通知错误码：", rsp.status);
        }
    }

    private notifyGameStart() {
        GameData.isRoomOwner = true;

        var event = {
            action: GameData.gameStartEvent,
            userIds: GameData.playerUserIds
        };

        GameData.response.sendEventResponse = this.sendEventResponse.bind(this); // 设置事件发射之后的回调
        var result = GameData.engine.sendEvent(JSON.stringify(event));
        if (result.result !== 0)
            return console.log('发送游戏开始通知失败，错误码' + result.result)

        // 发送的事件要缓存起来，收到异步回调时用于判断是哪个事件发送成功
        GameData.events[result.sequence] = event;
        console.log("发起游戏开始的通知，等待回复");
    }

    private sendEventResponse(rsp: MsSendEventRsp) {
        if (rsp.status !== 200) {
            return console.log('事件发送失败,status:' + status);
        }

        var event = GameData.events[rsp.sequence]

        if (event && event.action === GameData.gameStartEvent) {
            delete GameData.events[rsp.sequence];
            GameSceneView._gameScene.play();
        }
    }

    private sendEventNotify(sdnotify: MsSendEventNotify) {
        if (sdnotify
            && sdnotify.cpProto
            && sdnotify.cpProto.indexOf(GameData.gameStartEvent) >= 0) {

            GameData.playerUserIds = [GameData.userInfo.id];
            // 通过游戏开始的玩家会把userIds传过来，这里找出所有除本玩家之外的用户ID，
            // 添加到全局变量playerUserIds中
            JSON.parse(sdnotify.cpProto).userIds.forEach(function (userId) {
                if (userId !== GameData.userInfo.id) GameData.playerUserIds.push(userId);
            });
            GameSceneView._gameScene.play();
        }
    }
    private joinOverNotify(notifyInfo: MsJoinOverNotifyInfo) {
        console.log("userID:" + notifyInfo.srcUserID + " 关闭房间：" + notifyInfo.roomID + " cpProto:" + notifyInfo.cpProto);
    }
}