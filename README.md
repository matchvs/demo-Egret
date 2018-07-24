## Demo简介

为了便于开发者使用和理解，用 Matchvs 的实时联网 SDK 和 白鹭 `Egret` 开发的多人抢足球，提供了简洁的Demo来展示多人实时联网游戏的开发过程和效果，用于演示多人匹配、数据传输、帧同步、创建房间、获取房间列表、消息订阅、断线重连、修改房间属性等功能。Matchvs。

## 目录

v3.2.7.0 去除之前的 matchvs_wx 目录。现在目录如下：

````
┌─── matchvs 支持 Egret SDK库文件
├─── MatchvsDemo_Egret Demo 工程
└─── README.md
````



> 注意：v3.2.7.0 合并了 matchvs 与 matchvs_wx 的内容为 matchvs。
> 版本 v3.2.7.0 之前目录为
> ┌─── matchvs 支持 Egret SDK库文件
> ├─── matchvs_wx 支持微信小游戏的SDK库文件
> ├─── MatchvsDemo_Egret Demo 工程
> └─── README.md
> 

## Demo下载和体验

- [官网](http://www.matchvs.com/serviceDownload)
- [GitHub](https://github.com/matchvs/demo-Egret)
- [直接体验连接](http://demo.matchvs.com/Egret/)

## 文档

- [API 说明](https://github.com/matchvs/Doc/tree/master/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/API%20%E6%89%8B%E5%86%8C)
- [demo_Egret 使用教程](https://github.com/matchvs/Doc/blob/master/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/Demo%E6%95%99%E7%A8%8B/%E7%99%BD%E9%B9%ADEgret.md)



## Demo配置

Demo运行之前需要去 [Matchvs 官网](http://www.matchvs.com/) 配置游戏相关信息，以获取Demo运行所需要的GameID、AppKey、SecretID。如图：

![img](http://imgs.matchvs.com/static/2_1.png)

![img](http://imgs.matchvs.com/static/2_2.png)

获取到相关游戏信息之后，Demo 代码里在 `LoginView.ts` 文件下配置游戏信息，如下图：

![img](http://imgs.matchvs.com/static/egret/MatchvsDemo_Egret_3.png)

如果不了解Login这个函数的参数请到官网查看相关的 [API接口说明](http://www.matchvs.com/service?page=APIUnity) 文档。

> 注意： 如果运行不成功请查看 egretProperties.json 文件是否配置了加了如下配置：
>
> ```json
> { 
>     "name": "matchvs",
>     "path": "../matchvs"
> }
> ```

把游戏信息配置好就可以运行试玩，Demo运行界面如下，可以点击随机匹配开始：

![img](http://imgs.matchvs.com/static/egret//MatchvsDemo_Egret_4.png)

## 初始化SDK

在引入SDK之后，在初始化前需要先调用 `MatchvsEngine()`获取一个Matchvs引擎对象实例：

```typescript
public static engine:MatchvsEngine = new MatchvsEngine();
```

另外我们需要定义一个 `MatchvsResponse` 对象，该对象定义一些回调方法，用于获取游戏中玩家加入、离开房间、数据收发的信息，这些方法在特定的时刻会被SDK调用。

```typescript
public static response:MatchvsResponse = new MatchvsResponse();
```

为方便使用，我们把engine，reponse 以及以下其他全局变量放到单独的文件 GameData.ts 中。文件路径在Egret工程的src目录下面。完成以上步骤后，我们可以调用初始化接口建立相关资源。相关代码在LoginView文件。

```typescript
private onButtonClick(e: egret.TouchEvent) {
        GameData.response.initResponse = this.initResponse.bind(this);
        GameData.gameID = Number(this._gameidInput.text);
        console.log(" environment="+ this._environment + " gameid="+ GameData.gameID);
        //这里调用初始化
        let result = GameData.engine.init(GameData.response, GameData.CHANNEL, this._environment, GameData.gameID);
        console.log("mvs.init result:" + result);
    }
```

> **注意** 在整个应用全局，开发者只需要对引擎做一次初始化。DEMO代码有变动教程可能跟代码不完全符合。新的demo代码GameData.engine.init 改成 mvs.MsEngine.getInstance.init，把MatchvsEngine和MatchvsResponse 使用两个单例类重新封装。使用 Event 的形式接收消息。开发者请看 demo-Egret\MatchvsDemo_Egret\src\matchvs目录下的文件

## 建立连接

接下来，我们就可以从Matchvs获取一个合法的用户ID，通过该ID连接至Matchvs服务端。

获取用户ID：

```typescript
//LoginView.ts
GameData.response.registerUserResponse = this.registerUserResponse.bind(this);
var result = GameData.engine.registerUser();
if (result !== 0) {
console.log('注册用户失败，错误码:' + result);
} else {
console.log('注册用户成功');
}

private registerUserResponse(userInfo:MsRegistRsp) {
        //注册成功，userInfo包含相关用户信息
}
```

用户信息需要保存起来，我们使用一个类型为对象的全局变量GameData.userInfo来存储

```typescript
GameData.userInfo = userInfo;
```

登录：

```typescript
//LoginView.ts
GameData.response.loginResponse = this.loginResponse.bind(this);
var result = GameData.engine.login(userInfo.id, userInfo.token,200757, 1,"6783e7d174ef41b98a91957c561cf305", "da47754579fa47e4affab5785451622c",
deviceId, gatewayId);

private loginResponse(login:MsLoginRsp) {
    if (login.status != 200) {
        console.log("登陆失败");
    } else {
        console.log("登陆成功");
    }
}
```

## 加入房间

成功连接至Matchvs后，就会进入到Demo的游戏大厅界面，如上面游戏配置中的游戏大厅图。点击随机匹配可以开始加入随机房间啦。

示例代码如下：

```typescript
//MatchView.ts
GameData.response.joinRoomResponse = this.joinRoomResponse.bind(this);
GameData.response.joinRoomNotify = this.joinRoomNotify.bind(this);
GameData.engine.joinRandomRoom(GameData.maxPlayerNum, '');
//加入房间回调
private joinRoomResponse(status:number, roomuserInfoList:Array<MsRoomUserInfo>, roomInfo:MsRoomInfo) {
    //加入房间成功，status表示结果，roomUserInfoList为房间用户列表，roomInfo为房间信息
    if (status !== 200) {
        console.log("joinRoomResponse,status:" + status);
        return;
    }
    //这里处理自己加入房间的逻辑
}
private joinRoomNotify(roomUserInfo:MsRoomUserInfo) {
    //这里处理别人加入房间的逻辑
}
```

## 停止加入

我们设定如果有3个玩家匹配成功则满足开始条件且游戏设计中不提供中途加入，此时需告诉Matchvs不要再向房间里加人。

```typescript
class MatchView ...{
    private joinRoomResponse(status:number, roomuserInfoList:Array<MsRoomUserInfo>, roomInfo:MsRoomInfo) {
        if (status !== 200) {
            console.log("joinRoomResponse,status:" + status);
            return;
        }
        ......
        GameData.response.sendEventNotify = this.sendEventNotify.bind(this); // 设置事件接收的回调
        if (userIds.length >= GameData.maxPlayerNum) {
             // 关闭房间之后的回调
            GameData.response.joinOverResponse = this.joinOverResponse.bind(this);
            var result = GameData.engine.joinOver("");
            console.log("发出关闭房间的通知");
            if (result !== 0) {
                console.log("关闭房间失败，错误码：", result);
                return;
            }
            ......
        }
    }

    private joinOverResponse(rsp:MsJoinOverRsp) {
        if (rsp.status === 200) {
            console.log("关闭房间成功");
            ....
        } else {
            console.log("关闭房间失败，回调通知错误码：", rsp.status);
        }
    }
}
```

## 发出游戏开始通知

如果收到服务端的房间关闭成功的消息，就可以通知游戏开始了。

```typescript
class MatchView ...{

    ....

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

    private sendEventResponse(rsp:MsSendEventRsp) {
        if (rsp.status !== 200) {
            return console.log('事件发送失败,status:'+status);
        }

        var event = GameData.events[rsp.sequence]

        if (event && event.action === GameData.gameStartEvent) {
            delete GameData.events[rsp.sequence]
            GameSceneView._gameScene.play();
        }
    }

    private sendEventNotify(sdnotify:MsSendEventNotify) {
        if (sdnotify
            && sdnotify.cpProto
            && sdnotify.cpProto.indexOf(GameData.gameStartEvent) >= 0) {

            GameData.playerUserIds = [GameData.userInfo.id]
            // 通过游戏开始的玩家会把userIds传过来，这里找出所有除本玩家之外的用户ID，
            // 添加到全局变量playerUserIds中
            JSON.parse(sdnotify.cpProto).userIds.forEach(function(userId) {
                if (userId !== GameData.userInfo.id) GameData.playerUserIds.push(userId)
            });
            GameSceneView._gameScene.play();
        }
    }
}
```

游戏进行中在创建足球、玩家进行向左、向右操作时，我们将这些操作广播给房间内其他玩家。界面上同步展示各个玩家的状态变化。

其中足球是房主创建和展示，然后通知其他玩家，其他玩家收到消息后展示，相关的代码如下：

```typescript
//GamePlayerView.ts
private sendEventNotify(sdnotify:MsSendEventNotify) {

        if (sdnotify && sdnotify.cpProto) {
            if (sdnotify.cpProto.indexOf(GameData.newStarEvent) >= 0) {
                if(sdnotify.srcUserId != GameData.userInfo.id) {
                    //console.log("new star event");
                    var info = JSON.parse(sdnotify.cpProto);
                    GameData.starPositionX = info.x;
                    GameData.starPositionY = info.y;
                    this.createStar();
                }
                // 收到创建足球的消息通知，根据消息给的坐标创建足球

            } else if (sdnotify.cpProto.indexOf(GameData.playerPositionEvent) >= 0) {
                // 收到其他玩家的位置速度加速度信息，根据消息中的值更新状态
                this._receiveCountValue++;
                this._receiveMsgCountLabel.text = "receive msg count: " + this._receiveCountValue;
                var cpProto = JSON.parse(sdnotify.cpProto);

                if (sdnotify.srcUserId == GameData.userInfo.id) {
                    var delayValue = new Date().getTime() - cpProto.ts;
                    if (this._minDelayValue === undefined || delayValue < this._minDelayValue) {
                        this._minDelayValue = delayValue;
                    }
                    if (this._maxDelayValue === undefined || delayValue > this._maxDelayValue) {
                        this._maxDelayValue = delayValue;
                    }
                    this._delayLabel.text = "delay: " + delayValue + "\n" + "minDelay: " + this._minDelayValue + "\n" + "maxDelay: " + this._maxDelayValue; 
                } else {
                    //console.log("cpProto=" + JSON.stringify(cpProto) + " name1=" + this._egretBird1.name + "name2=" + this._egretBird2.name);
                    if (this._egretBird1.name == cpProto.uid) {
                        this._egretBird1.x = cpProto.x;
                        this._egretBird1.y = cpProto.y;
                    } else if (this._egretBird2.name == cpProto.uid) {
                        this._egretBird2.x = cpProto.x;
                        this._egretBird2.y = cpProto.y;
                    }
                }
            } else if (sdnotify.cpProto.indexOf(GameData.gainScoreEvent) >= 0) {
                // 收到其他玩家的得分信息，更新页面上的得分数据
            } else if (sdnotify.cpProto.indexOf(GameData.changeStarEvent) >= 0) {
                if(sdnotify.srcUserId != GameData.userInfo.id) {
                    //console.log("change star event");
                    var info = JSON.parse(sdnotify.cpProto);
                    this.changeStarPosition(info.x, info.y);
                    this.setUserScore(sdnotify.srcUserId, info.score);
                }
            }
        }
    }
```

小鸭子左右移动的时候会同步位置的信息给其他用户：

```typescript
// GamePlayerView.ts
//左移动
private onButtonClickLeft(e: egret.TouchEvent) {
    //console.log("onButtonClickLeft");
    if(this._egretBird0.x <= 0){
        this._egretBird0.x = 0;
    }else{
        this._egretBird0.x -= 20;
    }
    this.processStar();
}
//右移动
private onButtonClickRight(e: egret.TouchEvent) {

    if(this._egretBird0.x >= GameData.width){
        this._egretBird0.x = GameData.width;
    }else{
        this._egretBird0.x += 20;
    }
    this.processStar();
}

private processStar() {
    var length:number = Math.abs(this._egretBird0.x - this._star.x);
    console.log("length:" + length);
    if (length <= (this._star.width + this._egretBird0.width)/2) {
        this._score++;
        this.setUserScore(GameData.userInfo.id, this._score);

        var newX:number = 0;
        newX = Math.random() * this.stage.width;
        this.changeStarPosition(newX, GameData.defaultHeight);
        var eventTemp = {
            action: GameData.changeStarEvent,
            x: this._star.x,
            y: GameData.defaultHeight,
            score: this._score,
        }
        var result = GameData.engine.sendEvent(JSON.stringify(eventTemp));
        if (!result || result.result !== 0)
            return console.log('足球位置变更事件发送失败:' + JSON.stringify(result));        
    }
}
```

最终效果如下：

![img](http://imgs.matchvs.com/static/egret/MatchvsDemo_Egret_5.png)



## 修改房间属性

在创建房间界面可以选择不同的房间地图，房主在选择地图时，其他玩家会更新地图选项。调用修改房间属性的示例代码如下：

```typescript
//CreateRoomView.ts
class CreateRoomView extends egret.DisplayObjectContainer{
    //首先要设置回调
    GameData.response.setRoomPropertyNotify = this.setRoomPropertynotify.bind(this);
    GameData.response.setRoomPropertyResponse = this.setRoomPropertyResponse.bind(this);
    ....
    private radioChangeHandler(evt:eui.UIEvent):void {
        if(evt.target.value === 0){
            //地图A
            GameData.roomPropertyValue = GameData.roomPropertyType.mapA;
            GameData.engine.setRoomProperty(this._roomID,GameData.roomPropertyType.mapA);
        }else {
            //地图B
            GameData.roomPropertyValue = GameData.roomPropertyType.mapB;
            GameData.engine.setRoomProperty(this._roomID,GameData.roomPropertyType.mapB);
        }
    }
    private setRoomPropertynotify(notify:MsRoomPropertyNotifyInfo):void{
        console.log("roomProperty = "+notify.roomProperty);
        if(notify.roomProperty === GameData.roomPropertyType.mapB){
            GameData.roomPropertyValue = GameData.roomPropertyType.mapB;
            this._gameMapB.selected = true;
        }else{
            GameData.roomPropertyValue = GameData.roomPropertyType.mapA;
            this._gameMapA.selected = true;
        }
    }

    private setRoomPropertyResponse(rsp:MsSetRoomPropertyRspInfo):void{
        console.log("roomProperty = "+rsp.roomProperty);
    }
}
```

设置属性界面如下：

![img](http://imgs.matchvs.com/static/egret/MatchvsDemo_Egret_6.png)

## 断线重连

在游戏里面如果网络断开，可以调用 reconnect 函数重新连接，断线重新连接分为两种情况：

- 没有重新启动程序：在游戏进行时网络断开，直接调用 reconnect 重新连接到游戏。

```typescript
//ErrorView.ts
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
        //重连
        GameSceneView._gameScene.reconnectView();
    }
```

- 重新加载程序：先调用login 然后判断 loginResponse 中的参数 roomID 是否为0 如果不为 0 就调用reconnect 重连到房间。

示例代码：

```typescript
//LoginView.ts
private loginResponse(login:MsLoginRsp) {
		console.log("loginResponse, status=" + login.status);
		if (login.status != 200) {
			console.log("登陆失败");
		} else {
			console.log("登陆成功 roomID="+login.roomID);
            if(login.roomID !== "0"){
                //重新连接
                GameSceneView._gameScene.reconnectView();
            }else{
                GameSceneView._gameScene.lobby();
            }
		}
	}

// ReconnectView.ts
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
        }else{
            console.log("重连成功status:"+status+" 重连次数："+this._reconnctTimes);
        }
    ......
}
```
