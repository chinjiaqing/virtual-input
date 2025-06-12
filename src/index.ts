import { resolve } from 'node:path'
import koffi from 'koffi'

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
export class MsdkController {
  private static instance: MsdkController | null = null;
  private msdkLib: any;
  private loaded = false;
  
  // 禁止直接实例化
  private constructor() {}

  /**
   * 加载 MSDK DLL
   * @param dllPath 可选的自定义 DLL 路径
   * @returns Promise<MsdkController> 实例
   * @throws 如果加载失败
   */
  public static async load(dllPath?: string): Promise<MsdkController> {
    if (this.instance) {
      return this.instance;
    }
    
    this.instance = new MsdkController();
    await this.instance.initialize(dllPath);
    return this.instance;
  }

  /**
   * 卸载 DLL 并清理资源
   */
  public async unload(): Promise<void> {
    if (this.loaded) {
      this.msdkLib = null;
      this.loaded = false;
      MsdkController.instance = null;
    }
  }

  /**
   * 检查 DLL 是否已加载
   */
  public isLoaded(): boolean {
    return this.loaded;
  }

  // --------------------------
  // 以下为 DLL 函数实现（保持原注释）
  // --------------------------

  /**
   * 打开默认 VID、PID 的端口获取句柄
   *
   * 脚本应用程序启动后只需打开一次端口就可以
   * @param {number} nbr 盒子端口号，从1开始
   * @returns {number} 设备句柄
   */
  public M_Open(nbr: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_Open', 'int', ['int'])(nbr);
  }

  /**
   * 打开指定 VID、PID 的单头盒子或者双头盒子的主控端获取句柄
   * @param {number} vid 供应商ID
   * @param {number} pid 产品ID
   * @returns {number} 设备句柄
   */
  public M_Open_VidPid(vid: number, pid: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_Open_VidPid', 'int', ['int', 'int'])(vid, pid);
  }

  /**
   * 关闭端口
   *
   * 在脚本应用程序退出前再关闭端口
   * @param {number} handle 设备句柄
   * @returns {number} 操作结果
   */
  public M_Close(handle: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_Close', 'int', ['int'])(handle);
  }

  /**
   * 获取设备序列号
   * @param {number} handle 设备句柄
   * @param {number} bufSize 缓冲区大小
   * @param {string} buffer 缓冲区
   * @returns {number} 操作结果
   */
  public M_GetDevSn(handle: number, bufSize: number, buffer: string): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_GetDevSn', 'int', ['int', 'int', 'string'])(handle, bufSize, buffer);
  }

  /**
   * 写用户数据
   * @param {number} handle 设备句柄
   * @param {number} dataType 数据类型
   * @param {string} data 用户数据
   * @returns {number} 操作结果
   */
  public M_SetUserData(handle: number, dataType: number, data: string): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_SetUserData', 'int', ['int', 'int', 'string'])(handle, dataType, data);
  }

  /**
   * 验证用户数据
   * @param {number} handle 设备句柄
   * @param {number} dataType 数据类型
   * @param {string} data 用户数据
   * @returns {number} 操作结果
   */
  public M_VerifyUserData(handle: number, dataType: number, data: string): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_VerifyUserData', 'int', ['int', 'int', 'string'])(handle, dataType, data);
  }

  /**
   * 检查盒子是否是可修改盒子
   * @param {number} handle 设备句柄
   * @returns {number} 检查结果 (1=可修改, 0=不可修改)
   */
  public M_ChkSupportMdy(handle: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_ChkSupportMdy', 'int', ['int'])(handle);
  }

  /**
   * 设置新 VID/PID
   * @param {number} handle 设备句柄
   * @param {number} vid1 主供应商ID
   * @param {number} pid1 主产品ID
   * @param {number} vid2 次供应商ID (双头盒子)
   * @param {number} pid2 次产品ID (双头盒子)
   * @returns {number} 操作结果
   */
  public M_SetNewVidPid(handle: number, vid1: number, pid1: number, vid2: number, pid2: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_SetNewVidPid', 'int', ['int', 'int', 'int', 'int', 'int'])(
      handle, vid1, pid1, vid2, pid2
    );
  }

  /**
   * 复位盒子的 VID/PID，恢复成出厂设置
   *
   * 只支持可修改的单头、双头。普通单头、双头不支持
   * @param {number} handle 设备句柄
   * @returns {number} 操作结果
   */
  public M_ResetVidPid(handle: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_ResetVidPid', 'int', ['int'])(handle);
  }

  /**
   * 延时指定时间 time:单位 ms
   * @param {number} ms 延时时间(毫秒)
   * @returns {number} 操作结果
   */
  public M_Delay(ms: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_Delay', 'int', ['int'])(ms);
  }

  /**
   * 在指定的最小值和最大值之间延时随机时间 单位ms
   * @param {number} min 最小延时(毫秒)
   * @param {number} max 最大延时(毫秒)
   * @returns {number} 操作结果
   */
  public M_DelayRandom(min: number, max: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_DelayRandom', 'int', ['int', 'int'])(min, max);
  }

  /**
   * 在最小值、最大值之间取随机数
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @returns {number} 随机数
   */
  public M_RandDomNbr(min: number, max: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_RandDomNbr', 'int', ['int', 'int'])(min, max);
  }

  /**
   * DLL 内部参数恢复默认值
   * @param {number} handle 设备句柄
   * @returns {number} 操作结果
   */
  public M_InitParam(handle: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_InitParam', 'int', ['int'])(handle);
  }

  /**
   * 设置 DLL 内部参数
   * @param {number} handle 设备句柄
   * @param {number} paramType 参数类型
   * @param {number} paramValue 参数值
   * @param {number} reserved 保留参数
   * @returns {number} 操作结果
   */
  public M_SetParam(handle: number, paramType: number, paramValue: number, reserved: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_SetParam', 'int', ['int', 'int', 'int', 'int'])(
      handle, paramType, paramValue, reserved
    );
  }

  /**
   * 单击(按下后立刻弹起)指定按键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @param {number} delayMs 按下后延时(毫秒)
   * @returns {number} 操作结果
   */
  public M_KeyPress(handle: number, keyCode: number, delayMs: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_KeyPress', 'int', ['int', 'int', 'int'])(
      handle, keyCode, delayMs
    );
  }

  /**
   * 按下指定按键不弹起，如果按下不弹起，可以和其他按键组成组合键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 操作结果
   */
  public M_KeyDown(handle: number, keyCode: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_KeyDown', 'int', ['int', 'int'])(
      handle, keyCode
    );
  }

  /**
   * 弹起指定按键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 操作结果
   */
  public M_KeyUp(handle: number, keyCode: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_KeyUp', 'int', ['int', 'int'])(
      handle, keyCode
    );
  }

  /**
   * 读取按键状态；返回值：0=弹起状态；1:=按下状态
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 按键状态
   */
  public M_KeyState(handle: number, keyCode: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_KeyState', 'int', ['int', 'int'])(
      handle, keyCode
    );
  }

  /**
   * 单击(按下后立刻弹起)指定按键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @param {number} delayMs 按下后延时(毫秒)
   * @returns {number} 操作结果
   */
  public M_KeyPress2(handle: number, keyCode: number, delayMs: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_KeyPress2', 'int', ['int', 'int', 'int'])(
      handle, keyCode, delayMs
    );
  }

  /**
   * 按下指定按键不弹起，如果按下不弹起，可以和其他按键组成组合键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 操作结果
   */
  public M_KeyDown2(handle: number, keyCode: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_KeyDown2', 'int', ['int', 'int'])(
      handle, keyCode
    );
  }

  /**
   * 弹起指定按键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 操作结果
   */
  public M_KeyUp2(handle: number, keyCode: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_KeyUp2', 'int', ['int', 'int'])(
      handle, keyCode
    );
  }

  /**
   * 读取按键状态；返回值：0=弹起状态；1:=按下状态
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 按键状态
   */
  public M_KeyState2(handle: number, keyCode: number): number {
    this.ensureLoaded();
    return this.msdkLib.func('M_KeyState2', 'int', ['int', 'int'])(
      handle, keyCode
    );
  }

  // --------------------------
  // 私有方法
  // --------------------------

  private async initialize(customPath?: string): Promise<void> {
    try {
      const dllPath = customPath || resolve(__dirname, './dll/msdk_64.dll');
      this.msdkLib = koffi.load(dllPath);
      this.loaded = true;
    } catch (error) {
      throw new Error(`加载 DLL 失败: ${(error as Error).message}`);
    }
  }

  private ensureLoaded(): void {
    if (!this.loaded) {
      throw new Error('MSDK DLL 未加载，请先调用 load() 方法');
    }
  }
}

// 辅助函数：安全使用 MSDK 实例
export async function withMsdk<T>(
  callback: (msdk: MsdkController) => Promise<T>,
  dllPath?: string
): Promise<T> {
  const msdk = await MsdkController.load(dllPath);
  try {
    return await callback(msdk);
  } finally {
    try {
      await msdk.unload();
    } catch (error) {
      console.error('卸载 MSDK 时出错:', error);
    }
  }
}