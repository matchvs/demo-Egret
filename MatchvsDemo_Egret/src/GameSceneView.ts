class GameSceneView extends egret.Sprite
{
    public static _gameScene:GameSceneView;
    private thisContainer:egret.Sprite;
    constructor()
    {
        super();
        GameSceneView._gameScene = this;
        GameData.response.errorResponse = GameSceneView.errorResponse;
        this.initView();
    }
    public static errorResponse(errCode:number, errMsg:string){
        console.log("错误回调：errCode=" + errCode + " errMsg="+errMsg);
        GameSceneView._gameScene.errorView(0,"错误回调：errCode=" + errCode + " errMsg="+errMsg);
    }
    private initView():void
    {
        this.thisContainer = new egret.Sprite();
        this.addChild(this.thisContainer);
        this.login();
    }
    public login():void
    {
        this.removeAll();

        var loginview:LoginView = new LoginView();
        loginview.width = this.width;
        loginview.height = this.height;
        this.thisContainer.addChild(loginview);
    }
    public lobby():void
    {
        this.removeAll();
        var lobbyView:LobbyView = new LobbyView();
        this.thisContainer.addChild(lobbyView);
    }
    public match(tags ? :any):void{
        this.removeAll();
        if(tags){
            var matchView:MatchView = new MatchView(tags);
            this.thisContainer.addChild(matchView);
        }else{
            var matchView:MatchView = new MatchView();
            this.thisContainer.addChild(matchView);
        }
        
    }
	public play():void{
		this.removeAll();
        var gamePlay:GamePlayView = new GamePlayView();
        this.thisContainer.addChild(gamePlay);
	}

	public showResult():void{
		this.removeAll();
        var resultView:ResultView = new ResultView();
        this.thisContainer.addChild(resultView);
	}    

    public showRoomList(){
        this.removeAll();
        let roomlist:RoomListView = new RoomListView(this);
        this.thisContainer.addChild(roomlist);
        
    }

    public tagsMatchView(){
        this.removeAll();
        let tagsmatchvs = new TagsMatchView(this);
        this.thisContainer.addChild(tagsmatchvs);
        
    }

    /**
     * 创建房间
     */
    public createRoom(roomID ? :string, userPropery ?:string){
        this.removeAll();
        let containt:CreateRoomView = new CreateRoomView(this);
        if(!roomID){
            //创建房间
            containt.doCreateRoom();
        }else{
            //加入指定房间
            containt.doJoinRoomSpecial(roomID,userPropery);
        }
        this.thisContainer.addChild(containt);
    }

    /**
     * 通过房间号加入指定房间
     */
    public joinRoomSpecial(){
        this.removeAll();
        let joinroom = new JoinRoomSpecialView(this);
        this.thisContainer.addChild(joinroom);
    }

    public reconnectView(){
        this.removeAll();
        let reconnect = new ReconnectView(this);
        this.thisContainer.addChild(reconnect);
    }

    public errorView(pageNo:number,msg:string):void{
        this.removeAll();
        let errorView = new ErrorView(this);
        errorView.SetErrorMsg(msg);
        errorView.showReconnect();
        
        if(pageNo === 0){
            errorView.ReturnCallback = ()=>{
               this.login();
            };
        }else if (pageNo === 2){
            errorView.ReturnCallback = ()=>{
                GameSceneView._gameScene.lobby();
            };
        }
        
        this.thisContainer.addChild(errorView);
    }


    private removeAll():void
    {
        GameData.response.errorResponse = GameSceneView.errorResponse;
        this.thisContainer.removeChildren();
    }

    
}