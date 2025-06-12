/**
 * 易键鼠 MSDK 控制器类 - 封装所有 DLL 功能
 *
 * @example
 * const msdk = await MsdkController.load();
 * try {
 *   const handle = msdk.M_Open(1);
 *   // 使用其他功能...
 *   msdk.M_Close(handle);
 * } finally {
 *   await msdk.unload();
 * }
 */
declare class MsdkController {
    private static instance;
    private msdkLib;
    private loaded;
    private constructor();
    /**
     * 加载 MSDK DLL
     * @param dllPath 可选的自定义 DLL 路径
     * @returns Promise<MsdkController> 实例
     * @throws 如果加载失败
     */
    static load(dllPath?: string): Promise<MsdkController>;
    /**
     * 卸载 DLL 并清理资源
     */
    unload(): Promise<void>;
    /**
     * 检查 DLL 是否已加载
     */
    isLoaded(): boolean;
    /**
     * 打开默认 VID、PID 的端口获取句柄
     *
     * 脚本应用程序启动后只需打开一次端口就可以
     * @param {number} nbr 盒子端口号，从1开始
     * @returns {number} 设备句柄
     */
    M_Open(nbr: number): number;
    /**
     * 打开指定 VID、PID 的单头盒子或者双头盒子的主控端获取句柄
     * @param {number} vid 供应商ID
     * @param {number} pid 产品ID
     * @returns {number} 设备句柄
     */
    M_Open_VidPid(vid: number, pid: number): number;
    /**
     * 关闭端口
     *
     * 在脚本应用程序退出前再关闭端口
     * @param {number} handle 设备句柄
     * @returns {number} 操作结果
     */
    M_Close(handle: number): number;
    /**
     * 获取设备序列号
     * @param {number} handle 设备句柄
     * @param {number} bufSize 缓冲区大小
     * @param {string} buffer 缓冲区
     * @returns {number} 操作结果
     */
    M_GetDevSn(handle: number, bufSize: number, buffer: string): number;
    /**
     * 写用户数据
     * @param {number} handle 设备句柄
     * @param {number} dataType 数据类型
     * @param {string} data 用户数据
     * @returns {number} 操作结果
     */
    M_SetUserData(handle: number, dataType: number, data: string): number;
    /**
     * 验证用户数据
     * @param {number} handle 设备句柄
     * @param {number} dataType 数据类型
     * @param {string} data 用户数据
     * @returns {number} 操作结果
     */
    M_VerifyUserData(handle: number, dataType: number, data: string): number;
    /**
     * 检查盒子是否是可修改盒子
     * @param {number} handle 设备句柄
     * @returns {number} 检查结果 (1=可修改, 0=不可修改)
     */
    M_ChkSupportMdy(handle: number): number;
    /**
     * 设置新 VID/PID
     * @param {number} handle 设备句柄
     * @param {number} vid1 主供应商ID
     * @param {number} pid1 主产品ID
     * @param {number} vid2 次供应商ID (双头盒子)
     * @param {number} pid2 次产品ID (双头盒子)
     * @returns {number} 操作结果
     */
    M_SetNewVidPid(handle: number, vid1: number, pid1: number, vid2: number, pid2: number): number;
    /**
     * 复位盒子的 VID/PID，恢复成出厂设置
     *
     * 只支持可修改的单头、双头。普通单头、双头不支持
     * @param {number} handle 设备句柄
     * @returns {number} 操作结果
     */
    M_ResetVidPid(handle: number): number;
    /**
     * 延时指定时间 time:单位 ms
     * @param {number} ms 延时时间(毫秒)
     * @returns {number} 操作结果
     */
    M_Delay(ms: number): number;
    /**
     * 在指定的最小值和最大值之间延时随机时间 单位ms
     * @param {number} min 最小延时(毫秒)
     * @param {number} max 最大延时(毫秒)
     * @returns {number} 操作结果
     */
    M_DelayRandom(min: number, max: number): number;
    /**
     * 在最小值、最大值之间取随机数
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @returns {number} 随机数
     */
    M_RandDomNbr(min: number, max: number): number;
    /**
     * DLL 内部参数恢复默认值
     * @param {number} handle 设备句柄
     * @returns {number} 操作结果
     */
    M_InitParam(handle: number): number;
    /**
     * 设置 DLL 内部参数
     * @param {number} handle 设备句柄
     * @param {number} paramType 参数类型
     * @param {number} paramValue 参数值
     * @param {number} reserved 保留参数
     * @returns {number} 操作结果
     */
    M_SetParam(handle: number, paramType: number, paramValue: number, reserved: number): number;
    /**
     * 单击(按下后立刻弹起)指定按键
     * @param {number} handle 设备句柄
     * @param {number} keyCode 按键代码
     * @param {number} delayMs 按下后延时(毫秒)
     * @returns {number} 操作结果
     */
    M_KeyPress(handle: number, keyCode: number, delayMs: number): number;
    /**
     * 按下指定按键不弹起，如果按下不弹起，可以和其他按键组成组合键
     * @param {number} handle 设备句柄
     * @param {number} keyCode 按键代码
     * @returns {number} 操作结果
     */
    M_KeyDown(handle: number, keyCode: number): number;
    /**
     * 弹起指定按键
     * @param {number} handle 设备句柄
     * @param {number} keyCode 按键代码
     * @returns {number} 操作结果
     */
    M_KeyUp(handle: number, keyCode: number): number;
    /**
     * 读取按键状态；返回值：0=弹起状态；1:=按下状态
     * @param {number} handle 设备句柄
     * @param {number} keyCode 按键代码
     * @returns {number} 按键状态
     */
    M_KeyState(handle: number, keyCode: number): number;
    /**
     * 单击(按下后立刻弹起)指定按键
     * @param {number} handle 设备句柄
     * @param {number} keyCode 按键代码
     * @param {number} delayMs 按下后延时(毫秒)
     * @returns {number} 操作结果
     */
    M_KeyPress2(handle: number, keyCode: number, delayMs: number): number;
    /**
     * 按下指定按键不弹起，如果按下不弹起，可以和其他按键组成组合键
     * @param {number} handle 设备句柄
     * @param {number} keyCode 按键代码
     * @returns {number} 操作结果
     */
    M_KeyDown2(handle: number, keyCode: number): number;
    /**
     * 弹起指定按键
     * @param {number} handle 设备句柄
     * @param {number} keyCode 按键代码
     * @returns {number} 操作结果
     */
    M_KeyUp2(handle: number, keyCode: number): number;
    /**
     * 读取按键状态；返回值：0=弹起状态；1:=按下状态
     * @param {number} handle 设备句柄
     * @param {number} keyCode 按键代码
     * @returns {number} 按键状态
     */
    M_KeyState2(handle: number, keyCode: number): number;
    private initialize;
    private ensureLoaded;
}
declare function withMsdk<T>(callback: (msdk: MsdkController) => Promise<T>, dllPath?: string): Promise<T>;

export { MsdkController, withMsdk };
