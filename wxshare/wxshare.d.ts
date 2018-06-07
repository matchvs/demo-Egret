declare function getLaunchOptionsSync(): any;
declare function together(key:string,query:string):void;
declare function getWxUserInfo(callback:any):any;

/**
 * 获取 OpenID
 * @param obj {any} {success:function(res),fail:function(res)}
 */
declare function getUserOpenID(obj:any):any;

declare class TestTS{
	 getLaunchOptionsSync(): any;
	 together(key:string,query:string):void;
	 getWxUserInfo():any;
}