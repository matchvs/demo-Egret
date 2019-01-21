class MvsHttpApi {
	
	public open_host:string = GameData.DEFAULT_ENV == "release"? "https://vsopen.matchvs.com":"https://alphavsopen.matchvs.com";
    public user_host:string = GameData.DEFAULT_ENV == "release"? "https://vsuser.matchvs.com":"https://alphavsuser.matchvs.com";
	private rank_list:string = "/rank/ranking_list?";
    private rank_user:string = "/rank/grades?";
    private rank_config:string = "/rank/ranking_list_configs?";;

	private get_game_data:string = "/wc5/getGameData.do?";
	private set_game_data:string = "/wc5/setGameData.do?";
    private del_game_data:string = "/wc5/delGameData.do?";

    private set_user_data:string = "/wc5/setUserData.do?";
    private get_user_data:string = "/wc5/getUserData.do?";
    private del_user_data:string = "/wc5/delUserData.do?";

    private hase_set:string = "/wc5/hashSet.do?";
    private hash_get:string = "/wc5/hashGet.do?";

    // 第三方绑定
    private third_bind:string = "/wc6/thirdBind.do?";

    private counter:number = Math.floor(Math.random()*1000);
    private token = GameData.gameUser.token;
    private gameID = GameData.gameID;
    private userID = GameData.gameUser.id;
    private appkey = GameData.appkey;
    private secret = GameData.secretKey;
    
	
	public constructor() {
	}

	/**
     * 把参数中的 key, value  转为 key=value&key1=value2&key3=value3 形式
     * @param {any} args {key:value[, ...]} 形式
     */
	public static paramsParse(args:any){
        let str = "";
        for(let k in args){
            let val = "";
           
			if ( 'object' == (typeof args[k]) ) { 
                val = JSON.stringify(args[k]);
            }else{
                val = args[k];
            }
            if(str == ""){
                
                str = k + "=" + val;
            }else{
                str = str + "&" + k + "=" + val;
            }
        }
        return str;
    }

	/**
     * 组合 url 防止出现 host + path 出现两个 // 符号
     * @param {string} host 
     * @param  {...string} params 
     */
    public static url_Join(host, ...params) {
        let p = "";
        params.forEach(a => {
            if (typeof a == "object") {
                throw 'the parameter can only be string ';
            }
            if (a.substring(0,1) == '/'){
                p = p + a;
            }else{
                p = p + '/' + a;
            }
        });
        if (host.substring(host.length - 1, host.length) == '/') {
            p = host.substring(0, host.length - 1) + p;
        } else {
            p = host + p;
        }
        return p;
    }

    public getTimeStamp():number{
        return Math.floor(Date.now()/1000);
    }

    public getCounter(){
        return ++this.counter;
    }

    /**
     * 指定签名参数签名
     */
    public SignPoint(args:any, points:Array<string>){
        let tempobj = {}
        points.sort();
        points.forEach((val)=>{
            tempobj[val] = args[val];
        });

        if(args["seq"]){
            tempobj["seq"] = args["seq"];
        }
        if(args["ts"]){
            tempobj["ts"] = args["ts"];
        }

        let headKey:string = this.appkey;
        let endKey:string = args.mode == 2? this.secret: this.token;

        let paramStr = MvsHttpApi.paramsParse(tempobj);
        let md5Encode = new MD5()
        let sign = md5Encode.hex_md5(headKey+"&"+paramStr+"&"+endKey);
        return sign;
    }


	private dohttp( url:string, method:string, params:any, callback:Function){
        let headtype =  (method == "GET" ? "text/plain" : "application/json") ;
        var request = new XMLHttpRequest()
        request.open(method, url)
        request.setRequestHeader("Content-Type",headtype);
        if (method == "GET"){
            request.send();
        }else{
            let p = JSON.stringify(params);
            request.send(p);
        }
        request.onerror = (e)=>{
            if (typeof request.response == "object"){
                callback(null,JSON.parse(request.response));
            }else{
                callback(null,request.response);
            }
        }
        request.onreadystatechange = ()=>{
            if(request.readyState == 4){
                if( request.status == 200 ){
                    callback(JSON.parse(request.responseText), null);
                }else{
                    callback(null, " http request error "+request.responseText);
                }
            }
        }
	}

	public http_get(url, callback){
		this.dohttp(url, "GET", {}, callback);
	}

	public http_post(url, params ,callback){
		this.dohttp(url, "POST", params, callback);
	}

    public rankConfig(callback){
        let params = {
            gameID: this.gameID,
            rankinglistName: "rank_pCopper",
            rankGist: "pCopper",
            sortOrder: 0,
            updatePeriodType: 1,
            customStartTime: 0,
            customPeriod: 0,
            rankNum: 10,
            historyPeriodNum: 3,
            updateRuleType: 3,
            sign: "",
            userID: 0,
            mode:2,
        }
        params["sign"] = this.SignPoint(params, ["gameID"]);
        this.http_post(MvsHttpApi.url_Join(this.open_host, this.rank_config), params, callback);
    }

    /**
     * 获取排行榜数据
     */
	public GetRankListData(callback){
		let params = {
            pageMax:10,
            period:0,
            rankName:"totlal_rank",
            self:0,
            top: 50,
            userID: this.userID|| 0,
            gameID: this.userID,
            pageIndex:1,
            mode:1,
            seq: this.getCounter(),
            ts:this.getTimeStamp(),
        }
        params["sign"] = this.SignPoint(params,["gameID","userID"]);
        let param = MvsHttpApi.paramsParse(params);
		this.http_get(MvsHttpApi.url_Join(this.open_host,this.rank_list)+param,callback);
	}

    /**
     * 获取保存在全局 http 接口列表的用户信息
     */
    public GetUserInfoList(list:Array<any>,callback:Function){
        let keyList = [];
        list.forEach(k=>{
            keyList.push({key:k});
        });

        let data = {
            gameID   : this.gameID,
            userID   : this.userID || 0,
            keyList  : keyList,
            mode:2,
            sign : "",
            seq: this.getCounter(),
            ts:this.getTimeStamp(),
        }

        data.sign = this.SignPoint(data,["gameID","userID"]);
        let param = MvsHttpApi.paramsParse(data);
		this.http_get(MvsHttpApi.url_Join(this.open_host, this.get_game_data)+param, callback);
    }

    /**
     * 保存全局数据
     */
    public setGameData(userID:number, list:Array<any>, callback:Function){
        let listInfo = [];
        list.forEach(user=>{
            listInfo.push({
                key: user.userID,
                value: ArrayTools.Base64Encode(JSON.stringify({ name: user.name, avatar: user.avatar })),
            });
        });
        let params = {
            gameID : this.gameID,
            userID : userID,
            dataList: listInfo,
            sign : "",
            mode:2,
            seq: this.getCounter(),
            ts:this.getTimeStamp(),
        }
        params.sign = this.SignPoint(params, ["gameID","userID"]);
		this.http_post(MvsHttpApi.url_Join(this.open_host, this.set_game_data), params, callback);
    }

    /**
     * 删除全局接口数据
     */
    public delGameData(userID:number, list:Array<any>, callback){
        let keyList = [];
        list.forEach(k=>{
            keyList.push({key:k});
        });
        let args = {
            gameID:  this.gameID,
            userID:  userID,
            keyList: keyList,
            sign: "",
            mode:2,
            seq: this.getCounter(),
            ts:this.getTimeStamp(),
        }
        args.sign = this.SignPoint(args,["gameID","userID"]);
        let params = MvsHttpApi.paramsParse(args);
		this.http_get(MvsHttpApi.url_Join(this.open_host, this.del_game_data) + params, callback);
    }

    /**
     * 获取某个用户排行
     */
    public GetUserRank(userID, callback){
        let grades = {
            userID: userID,
            gameID: this.gameID,
            type: 0,                 // 类型，取值0或者1，0排行榜，1快照
            rankName: "totlal_rank", //排行榜名称
            rank: 0,                 //范围
            period: 0,               //周期，取值0或1，0当前周期，1上一周期
            mode:1,
            seq: this.getCounter(),
            ts : this.getTimeStamp(),
        }
        grades["sign"] = this.SignPoint(grades, ["gameID","userID"]);
        let param = MvsHttpApi.paramsParse(grades);
		this.http_get(MvsHttpApi.url_Join(this.open_host, this.rank_user)+param,callback);
    }

    /**
     * 保存用户接口数据
     * @param {} list
     * @param {} list.name
     * @param {} list.userID
     * @param {} list.avatar
     */
    public setUserData(userID, list, callback){
        let listInfo = [];
        list.forEach(user=>{
            listInfo.push({
                key: user.userID,
                value: ArrayTools.Base64Encode(JSON.stringify({ name: user.name, avatar: user.avatar })),
            });
        });
        let params = {
            gameID : this.gameID,
            userID : userID,
            dataList: listInfo,
            sign : "",
            mode : 1,
            seq: this.getCounter(),
            ts:this.getTimeStamp(),
        }
        params.sign = this.SignPoint(params, ["gameID", "userID"]);
        let args = MvsHttpApi.paramsParse(params);
		this.http_get(MvsHttpApi.url_Join(this.open_host, this.set_user_data)+args, callback);
    }

    /**
     * 获取用户接口数据 
     * @param {Array<number>} List
     */
    public getUserData(userID:number, list:Array<number>, callback:Function){
        let keyList = [];
        list.forEach(k=>{
            keyList.push({key:k});
        });
        let args = {
            gameID:  this.gameID,
            userID:  userID,
            keyList: keyList,
            sign: "",
            mode:1,
            seq: this.getCounter(),
            ts:this.getTimeStamp(),
        }
        args.sign = this.SignPoint(args, ["gameID","userID"]);
        let params = MvsHttpApi.paramsParse(args);
		this.http_get(MvsHttpApi.url_Join(this.open_host, this.get_user_data)+params, callback);
    }

    /**
     * 删除用户接口数据
     */
    public delUserData(userID, list, callback){
        let keyList = [];
        list.forEach(k=>{
            keyList.push({key:k});
        });
        let args = {
            gameID:  this.gameID,
            userID:  userID,
            keyList: keyList,
            sign: "",
            mode:1,
            seq: this.getCounter(),
            ts:this.getTimeStamp(),
        }
        args.sign = this.SignPoint(args, ["gameID","userID"]);
        let params = MvsHttpApi.paramsParse(args);
		this.http_get(MvsHttpApi.url_Join(this.open_host, this.del_user_data)+params, callback);
    }

    /**
     * 存哈希
     */
    public hashSet(userID:number, k:string, v:string, callback:Function){
        let params = {
            gameID: this.gameID,
            key: k,
            userID: userID,
            value: v,
            sign:"",
            mode : 1,
            seq: this.getCounter(),
            ts:this.getTimeStamp(),
        }
        params.sign = this.SignPoint(params, ["gameID","userID","value","key"]);
        this.http_post(MvsHttpApi.url_Join(this.open_host, this.hash_get), params, callback);
    }

    /**
     * 取哈希
     */
    public hashGet(userID:number, k:string, callback:Function){
        let params = {
            gameID: this.gameID,
            key: k,
            userID: userID,
            sign:"",
            mode : 1,
            seq: this.getCounter(),
            ts:this.getTimeStamp(),
        }
        params.sign = this.SignPoint(params, ["gameID", "userID", "key"]);
        this.http_get(MvsHttpApi.url_Join(this.open_host, this.hash_get) + params, callback);
    }

    public thirdBind(openid:string, sessionkey:string, callback:Function){
        let params = {
            userID:0,
            gameID:this.gameID,
            openID:openid,
            session:sessionkey,
            thirdFlag:1,
            sign:"",
            mode: 2, // 设置签名方法
        };
        // 指定签名的参数进行签名
        params.sign = this.SignPoint(params, ["gameID", "openID", "session", "thirdFlag"]);
        this.http_post(MvsHttpApi.url_Join(this.user_host, this.third_bind), params, callback);
    }


    public static TestApi(){
        let req:MvsHttpApi = new MvsHttpApi();
        req.setUserData(GameData.gameUser.id, [{userID:12345, name:"matchvs_test", avatar:"sdjflsdkjfljlkjljl"}], (res, err)=>{
            if(res){
                console.log("TestApi success:", res);
            }else if(err){
                console.log("TestApi fail:", err);
            }
        });
    }

    public static TestRankConfig(){
        let req:MvsHttpApi = new MvsHttpApi();
        req.thirdBind("123456","lsdjkfjoemgllfjslmljglml",
            (res, err)=>{
            if(res){
                console.log("TestApi success:", res);
            }else if(err){
                console.log("TestApi fail:", err);
            }
        }
        );
        req.rankConfig(
            (res, err)=>{
            if(res){
                console.log("rankConfig success:", res);
            }else if(err){
                console.log("rankConfig fail:", err);
            }
        }
        );
    }
}