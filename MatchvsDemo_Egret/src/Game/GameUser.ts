class GameUser {

	public id:number = 0;	//用户ID
	public name:string = "";	//名称
	public avatar:string = "http://pic.vszone.cn/upload/avatar/1464079970.png";
	public token:string = "";			//校验值
	public pValue:number = 0;			//积分
	public isOwner = false;				//房主标记

	public constructor() {
	}
}