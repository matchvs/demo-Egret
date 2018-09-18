class GameData {
    public static CHANNEL = "MatchVS";
    public static DEFAULT_ENV = "alpha";
    public static ENVIRONMENT = { "dev": "alpha", "pro": "release" }
    public static gameID: number = 201489;//200757;
    public static appkey: string = "4fb6406305f44f1aad0c40e5946ffe3d";//6783e7d174ef41b98a91957c561cf305
    public static secretKey: string = "5035d62b75bd4941b182579f2b8fc12c";//da47754579fa47e4affab5785451622c

    public static gameUser: GameUser = new GameUser();
    public static playerUserIds: Array<GameUser> = [];

    public static matchType: number = 0; //匹配类型
    public static randomMatch: number = 1;//随机匹配
    public static specialMatch: number = 2;//指定房间号匹配
    public static tagsMatch: number = 3; //指定属性匹配
    public static maxPlayerNum: number = 3;
    public static isRoomOwner: boolean = false;
    
    public static gameStartEvent: string = "gameStart";
    public static playerPositionEvent: string = "playerPosition";
    public static reconnectStartEvent: string = "gameReconnectStart";
    public static newStarEvent: string = "newStar";
    public static changeStarEvent: string = "changeStar";
    public static gameReadyEvent: string = "gameReady";
    public static reconnectReadyEvent: string = "gameReconnectReady";

    public static events = {};
    public static syncFrame: boolean = false;
    public static isGameOver: boolean = false;
    public static starPositionX: number = 0;
    public static starPositionY: number = 0;
    public static frameRate: number = 5;
    public static defaultHeight: number = 400;
    public static roomID: string = "";
    public static intervalList: Array<number> = []; //定时器列表
    public static number1: string = "";
    public static number2: string = "";
    public static number3: string = "";
    public static width: number;
    public static height: number;
    public static playerTime: number = 60;
    public static roomPropertyType = { "mapA": "mapA", "mapB": "mapB" };
    public static roomPropertyValue = "mapA";
    public static createRoomInfo = new MsCreateRoomInfo("MatchvsDemoEgret", 3, 0, 0, 1, "mapA");

    public static init(){
        this.isGameOver = true;
        this.isRoomOwner = false;
        this.syncFrame = false;
        this.number1 = "";
        this.number2 = "";
        this.number3 = "";
        this.roomID = "";
        this.intervalList = [];
        this.playerUserIds = [];
        this.roomPropertyValue = this.roomPropertyType.mapA;
    }

    public static configEnvir(channel, isdebug) {
        GameData.CHANNEL = channel;
        GameData.DEFAULT_ENV = isdebug ? GameData.ENVIRONMENT.dev : GameData.ENVIRONMENT.pro;
        if (channel === "MatchVS") {
            GameData.gameID=201150;
            GameData.appkey="0db8550d9bd345da82b852564f59d2e6";
            GameData.secretKey="15bf7e1bc2454d21b071d67f568e257c";
        }

        if (channel === "MatchVS-Test") {
            GameData.gameID=201170;
            GameData.appkey="a5b937f29a4c480bb6946093105c0565";
            GameData.secretKey="a8c5c84afde44136a5eea6f0ac09887c";
        }

        if (channel === "MatchVS-Test1") {
            GameData.gameID=201078;
            GameData.appkey="938e1ee0db444a079fe0695598677ba0";
            GameData.secretKey="9b11e0eca09141a1961d49d6b6028075";
        }
    }

    /**
     * 获取绑定openID地址
     */
    public static getBindOpenIDAddr(channel:string, platform:string):string{
        if(channel == "MatchVS" || channel == "Matchvs"){
            if(platform == "release"){
                return "http://vsuser.matchvs.com/wc6/thirdBind.do?"
            }else if(platform == "alpha"){
                return "http://alphavsuser.matchvs.com/wc6/thirdBind.do?";
            }
        }else if(channel == "MatchVS-Test1"){
            if(platform == "release"){
                return "http://zwuser.matchvs.com/wc6/thirdBind.do?"
            }else if(platform == "alpha"){
                return "http://alphazwuser.matchvs.com/wc6/thirdBind.do?";
            }
        }
        
    }


    /**
     * 获取签名
     */
    public static getSign(params:string):string{
        let str = GameData.appkey+"&"+params+"&"+GameData.secretKey;
        console.info("待签名："+str);
        let md5Str:string = new MD5().hex_md5(str);
        return md5Str;
    }
}