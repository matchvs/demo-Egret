class GameSceneView extends egret.Sprite
{
    public static _gameScene:GameSceneView;
    private thisContainer:egret.Sprite;
    private cuntPage:any;
    constructor()
    {
        super();
        GameSceneView._gameScene = this;
        this.initView();
    }
    public static errorResponse(errCode:number, errMsg:string){
        console.log("错误回调：errCode=" + errCode + " errMsg="+errMsg);
        GameSceneView._gameScene.errorView(0,"错误回调：errCode=" + errCode + " errMsg="+errMsg);
    }
    private errorResponses(event:egret.Event){
        //mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_ERROR_RSP, this.errorResponse, this);
        let errcode:number = event.data.errCode;
        let errmsg:string = event.data.errMsg;
        if(errcode == 1001){
            if(errmsg != "" && errmsg.indexOf("hotel") >= 0){
                GameSceneView._gameScene.errorView(1,"错误回调：errCode=" + errcode + " errMsg="+errmsg);
            }else{
                 GameSceneView._gameScene.errorView(0,"错误回调：errCode=" + errcode + " errMsg="+errmsg);
            }
        }
    }
    private initView():void
    {
         mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_ERROR_RSP, this.errorResponses, this);
        this.thisContainer = new egret.Sprite();
        this.addChild(this.thisContainer);
        this.wechart();
        // this.startModel();
    }

    public startModel(){
        this.removeAll();
        let starting:StartModelUI = new StartModelUI();
        this.thisContainer.addChild(starting);
    }

    public premiseLogin(){
        this.removeAll();
        var loginview:PremiseLoginUI = new PremiseLoginUI();
        this.thisContainer.addChild(loginview);
    }

    public login():void
    {
        this.removeAll();
        var loginview:Login = new Login();
        this.thisContainer.addChild(loginview);
    }

    public wechart(){
        this.removeAll();
        let w:WeChart = new WeChart();
        this.thisContainer.addChild(w);
    }

    public lobby():void
    {
        this.removeAll();
        var lobbyView:Lobby = new Lobby();
        this.thisContainer.addChild(lobbyView);
    }
    public match(tags:number, info?:any):void{
        this.removeAll();
        let match:MatchUI = new MatchUI();
        match.setJoinParame(tags, info);
        this.thisContainer.addChild(match);
    }

	public play():void{
		this.removeAll();
        let gamePlay:GamePlayView = new GamePlayView();
        this.cuntPage = gamePlay;
        this.thisContainer.addChild(gamePlay);
	}

	public showResult(users:Array<GameUser>, roomID:string):void{
		this.removeAll();
        let resultView:GameResult = new GameResult();
        resultView.setResult(users, roomID);
        this.thisContainer.addChild(resultView);
	}    

    public showRoomList(){
        this.removeAll();
        let roomlist:RoomListUI = new RoomListUI();
        this.thisContainer.addChild(roomlist);
        
    }

    public tagsMatchView(){
        this.removeAll();
        let tagsmatchvs = new MatchProperty();
        this.thisContainer.addChild(tagsmatchvs);
        
    }

    /**
     * 创建房间
     */
    public createRoom(roomID ? :string, userPropery ?:string){
        this.removeAll();
        let containt:MatchUI = new MatchUI();
        // if(!roomID){
        //     //创建房间
        //     containt.doCreateRoom();
        // }else{
        //     //加入指定房间
        //     containt.doJoinRoomSpecial(roomID,userPropery);
        // }
        containt.setJoinParame(MatchUI.JOINFLAG.CREATEROOM);
        this.thisContainer.addChild(containt);
    }

    /**
     * 通过房间号加入指定房间
     */
    public joinRoomSpecial(){
        this.removeAll();
        let joinroom = new MatchRoomID();
        this.thisContainer.addChild(joinroom);
    }

    public reconnectView(){
        this.removeAll();
        let reconnect = new ReconnectUI();
        this.thisContainer.addChild(reconnect);
    }

    public errorView(pageNo:number,msg:string):void{
        this.removeAll();
        GameData.init();
        let errorView = new ErrorNote();
        errorView.SetErrorMsg(msg);
        // errorView.showReconnect();
        //登录界面
        if(pageNo === 0){
            // errorView.ReturnCallback = ()=>{
            //    this.login();
            // };
        }else if (pageNo === 2){//登录界面游戏大厅界面
            // errorView.ReturnCallback = ()=>{
            //     GameSceneView._gameScene.lobby();
            // };
        }
        
        this.thisContainer.addChild(errorView);
    }

    private removeAll():void
    {
        if(this.cuntPage && this.cuntPage.release){
            console.log("释放");
            this.cuntPage.release();
            this.cuntPage = null;
        }
        this.thisContainer.removeChildren();
    }

    
}