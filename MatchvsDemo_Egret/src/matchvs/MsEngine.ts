module mvs {
	/**
	 * 这个是 matchvs 引擎 接口封装模块，对引擎的所有请求接口进行了二次封装，一些接口调用的参数可以在这里组合
	 */
	export class MsEngine {
		private static _instance = null;
		private _engine:MatchvsEngine = null; //Matchvs 引擎
		private _response:MatchvsResponse = null; 
		public constructor() {
			this._engine = new MatchvsEngine();
		}

		/**
		 * 获取类实例
		 */
		public static get getInstance():MsEngine{
			if(MsEngine._instance == null){
				MsEngine._instance = new MsEngine();
			}
			return MsEngine._instance;
		}

		/**
		 * 初始化
		 * @param {string} channel
		 * @param {string} platform
		 * @param {number} gameID
		 */
		public init(channel:string, platform:string, gameID:number, appkey:string):number{
			this._response = MsResponse.getInstance.getResponse();
			let res = this._engine.init(MsResponse.getInstance.getResponse(),channel,platform,gameID,appkey, 1);
			if (res !== 200){
				console.info("[MsEngine init failed] resCode:",res);
				return res;
			}
			console.info("[MsEngine init seccess] resCode:",res);
			return res;
		}

		/**
		 * 独立部署的初始化
		 */
		public premiseInit(endPoint:string, gameID:number, appkey:string):number{
			this._response = MsResponse.getInstance.getResponse();
			let res = this._engine.premiseInit( MsResponse.getInstance.getResponse(),endPoint, gameID, appkey);
			if (res !== 0){
				console.info("[MsEngine premiseInit failed] resCode:",res);
				return res;
			}
			console.info("[MsEngine premiseInit seccess] resCode:",res);
			return res;
		}

		/**
		 * 用户登录
		 * @param {number} userID 		用户ID
		 * @param {string} token 		用户token 注册时生成的
		 * @param {number} gameID 		游戏ID
		 * @param {string} appkey 		游戏 appkey
		 * @param {string} secretkey 	游戏 secretkey
		 */
		public login(userID:number, token:string):number{
			let res = this._engine.login(userID,token,"eglejjddg");
			console.info("[MsEngine login] resCode:",res);
			return res;
		}


		/**
		 * 注册用户
		 * @returns {number} 0-接口调用成功
		 */
		public registerUser():number{
			let res = this._engine.registerUser();
			if (res !== 0){
				console.error("[MsEngine registerUser failed] resCode:",res);
				return res;
			}
			console.info("[MsEngine registerUser seccess] resCode:",res);
			return res;
		}

		/**
		 * 随机加入房间
		 * @param {number} maxPlayer 最大人数
		 * @param {string} userProfile 附带数据，默认指定 ""
		 * @returns {number}
		 */
		public joinRandomRoom(maxPlayer:number, userProfile:string):number{
			let res = this._engine.joinRandomRoom(maxPlayer,userProfile);
			console.info("[MsEngine joinRandomRoom ] resCode:",res);
			return res;
		}

		/**
		 * 属性加入房间
		 * @param {MsMatchInfo} matchinfo
		 * @param {string} userProfile 附带数据，默认指定 ""
		 * @returns {number}
		 */
		public joinRoomWithProperties(matchinfo:MsMatchInfo, userProfile:string):number{
			let res = this._engine.joinRoomWithProperties(matchinfo,userProfile);
			console.info("[MsEngine joinRandomRoom ] resCode:",res);
			return res;
		}

		/**
		 * 指定房间号加入房间
		 */
		public joinRoom(roomID:string,userProfile:string){
			let res = this._engine.joinRoom(roomID,userProfile);
			console.info("[MsEngine joinRoom ] resCode:",res);
			return res;
		}

		/**
		 * 创建房间
		 * @param {MsCreateRoomInfo} createRoomInfo 房间信息
		 * @param {string} userProfile 附带数据，默认指定
		 * @returns {number}
		 */
		public createRoom(createRoomInfo:MsCreateRoomInfo, userProfile:string):number{
			let res = this._engine.createRoom(createRoomInfo,userProfile);
			console.info("[MsEngine createRoom ] resCode:",res,JSON.stringify(createRoomInfo),userProfile);
			return res;
		}

		/**
		 * 禁止加入房间
		 * @param {string} cpProto 禁止加入房间附带的数据
		 * @returns {number}
		 */
		public joinOver(cpProto:string):number{
			let res = this._engine.joinOver(cpProto);
			console.info("[MsEngine joinOver ] resCode:",res);
			return res;
		}

		/**
		 * 设置允许房间加人
		 * @param {number} cpProto
		 * @returns {number}
		 */
		public joinOpen(cpProto:string):number{
			let res = this._engine.joinOpen(cpProto);
			console.info("[MsEngine joinOpen ] resCode:",res);
			return res;
		}

		/**
		 * 离开房间
		 * @param {string} cpProto 离开房间附带的数据
		 * @returns {number}
		 */
		public leaveRoom(cpProto:string):number{
			let res = this._engine.leaveRoom(cpProto);
			console.info("[MsEngine leaveRoom ] resCode:",res);
			return res;
		}

		/**
		 * 发送消息
		 * @param {string} data 		发送的数据
		 */
		public sendEvent(data:string):any{
			let res = this._engine.sendEvent(data);
			//console.info("[MsEngine sendEvent ] resCode:",JSON.stringify(res));
			return res;
		}

		/**
		 * 发送消息的扩展，
		 * @param {number} msgType          0-包含destUids  1-排除destUids
		 * @param {string} data             要发送的数据
		 * @param {number} desttype         0-客户端+not CPS  1-not客户端+ CPS   2-客户端 + CPS
		 * @param {Array<number>} userids   玩家ID集合 [1,2,3,4,5]
		 * @returns {{sequence: number, result: number}}
     	*/
		public sendEventEx(msgType:number, data:string, desttype:number, userids:Array<number>):any{
			let res = this._engine.sendEventEx(msgType, data, desttype, userids);
			//console.info("[MsEngine sendEventEx ] resCode:",JSON.stringify(res));
			return res;
		}

		/**
		 *
		 * @param {string} cpProto
		 * @returns {number}
		 */
		public sendFrameEvent(cpProto:string):number{
			let res = this._engine.sendFrameEvent(cpProto,0);
			console.info("[MsEngine sendFrameEvent ] resCode:",res);
			return res;
		}

		/**
		 * frameRate ex:10/s . = 0 is off,>0 is on.
		 * @param {number} frameRate
		 * @returns {number}
		 */
		public setFrameSync(frameRate:number):number{
			let res = this._engine.setFrameSync(frameRate);
			console.info("[MsEngine setFrameSync ] resCode:",res);
			return res;
		}

		/**
		 * 退出登录
		 * @param {number} cpProto
		 * @returns {number}
		 */
		public logOut():number{
			let res = this._engine.logout("退出登录");
			console.info("[MsEngine setFrameSync ] resCode:",res);
			return res;
		}


		/**
		 *
		 * @param {number} userID 被踢者用户ID
		 * @param {string} cpProto 踢人附带的消息
		 * @returns {number}
		 */
		public kickPlayer(userID:number, cpProto:string):number{
			let res = this._engine.kickPlayer(userID,cpProto);
			console.info("[MsEngine kickPlayer ] resCode:", res);
			return res;
		}

		/**
		 * 获取房间详细信息
		 * @param {string} roomID
		 * @returns {number}
		 */
		public getRoomDetail(roomID:string):number{
			let res = this._engine.getRoomDetail(roomID);
			console.info("[MsEngine getRoomDetail ] resCode:", res);
			return res;
		}

		/**
		 * 获取房间列表信息
		 * @param {MsRoomFilter} filter
		 * @returns {number}
		 */
		public getRoomList(filter:MsRoomFilter):number{
			let res = this._engine.getRoomList(filter);
			console.info("[MsEngine getRoomList ] resCode:", res);
			return res;
		}

		/**
		 * 获取房间列表扩展接口
		 * @param {MsRoomFilterEx} filter
		 * @returns {number}
		 */
		public getRoomListEx(filter:MsRoomFilterEx):number{
			let res = this._engine.getRoomListEx(filter);
			console.info("[MsEngine getRoomListEx ] resCode:", res);
			return res;
		}

		/**
		 * 设置房间属性
		 * @param {string} roomID
		 * @param {string} roomProperty
		 * @returns {number}
		 */
		public setRoomProperty(roomID:string, roomProperty:string):number{
			let res = this._engine.setRoomProperty(roomID, roomProperty);
			console.info("[MsEngine setRoomProperty ] resCode:", res);
			return res;
		}

		/**
		 * 断线重连
		 * @returns {number}
		 */
		public reconnect():number{
			let res = this._engine.reconnect();
			console.info("[MsEngine reconnect ]", res);
			return res;
		}

	}
}