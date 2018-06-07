class ResultView extends eui.UILayer {
	public constructor() {
		super();
		this.initView();
	}
	private initView():void {
        let headLabel = new eui.Label();
        headLabel.textColor = 0xffffff;
        headLabel.fontFamily = "Tahoma";  //设置字体
		headLabel.text = "比赛结果";
        headLabel.x = GameData.width / 2 -20
		headLabel.y = 20;
        this.addChild(headLabel);

        let resultLabel = new eui.Label();
        resultLabel.textColor = 0xffffff;
        resultLabel.fontFamily = "Tahoma";  //设置字体
		resultLabel.text = GameData.number1 + "\n" + GameData.number2 + "\n" + GameData.number3;
        resultLabel.x = GameData.width / 2 -20
		resultLabel.y = 60;
        this.addChild(resultLabel);

        let buttonLeave = new eui.Button();
        buttonLeave.label = "离开游戏";
        buttonLeave.x = GameData.width/2 - 20;
        buttonLeave.y = GameData.height - 50;
        this.addChild(buttonLeave);
		buttonLeave.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonLeaveRoom, this);
	}
	private onButtonLeaveRoom(e: egret.TouchEvent) {
		console.log("onButtonLeaveRoom");
		mvs.MsEngine.getInstance.leaveRoom("游戏玩完一次离开");
		GameSceneView._gameScene.lobby();
		GameData.isRoomOwner = false;
		GameData.syncFrame = false;
	}	
}