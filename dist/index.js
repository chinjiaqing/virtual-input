"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  MsdkController: () => MsdkController,
  withMsdk: () => withMsdk
});
module.exports = __toCommonJS(index_exports);
var import_node_path = require("path");
var import_koffi = __toESM(require("koffi"));
var _MsdkController = class _MsdkController {
  // 禁止直接实例化
  constructor() {
    this.loaded = false;
  }
  /**
   * 加载 MSDK DLL
   * @param dllPath 可选的自定义 DLL 路径
   * @returns Promise<MsdkController> 实例
   * @throws 如果加载失败
   */
  static async load(dllPath) {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new _MsdkController();
    await this.instance.initialize(dllPath);
    return this.instance;
  }
  /**
   * 卸载 DLL 并清理资源
   */
  async unload() {
    if (this.loaded) {
      this.msdkLib = null;
      this.loaded = false;
      _MsdkController.instance = null;
    }
  }
  /**
   * 检查 DLL 是否已加载
   */
  isLoaded() {
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
  M_Open(nbr) {
    this.ensureLoaded();
    return this.msdkLib.func("M_Open", "int", ["int"])(nbr);
  }
  /**
   * 打开指定 VID、PID 的单头盒子或者双头盒子的主控端获取句柄
   * @param {number} vid 供应商ID
   * @param {number} pid 产品ID
   * @returns {number} 设备句柄
   */
  M_Open_VidPid(vid, pid) {
    this.ensureLoaded();
    return this.msdkLib.func("M_Open_VidPid", "int", ["int", "int"])(vid, pid);
  }
  /**
   * 关闭端口
   *
   * 在脚本应用程序退出前再关闭端口
   * @param {number} handle 设备句柄
   * @returns {number} 操作结果
   */
  M_Close(handle) {
    this.ensureLoaded();
    return this.msdkLib.func("M_Close", "int", ["int"])(handle);
  }
  /**
   * 获取设备序列号
   * @param {number} handle 设备句柄
   * @param {number} bufSize 缓冲区大小
   * @param {string} buffer 缓冲区
   * @returns {number} 操作结果
   */
  M_GetDevSn(handle, bufSize, buffer) {
    this.ensureLoaded();
    return this.msdkLib.func("M_GetDevSn", "int", ["int", "int", "string"])(handle, bufSize, buffer);
  }
  /**
   * 写用户数据
   * @param {number} handle 设备句柄
   * @param {number} dataType 数据类型
   * @param {string} data 用户数据
   * @returns {number} 操作结果
   */
  M_SetUserData(handle, dataType, data) {
    this.ensureLoaded();
    return this.msdkLib.func("M_SetUserData", "int", ["int", "int", "string"])(handle, dataType, data);
  }
  /**
   * 验证用户数据
   * @param {number} handle 设备句柄
   * @param {number} dataType 数据类型
   * @param {string} data 用户数据
   * @returns {number} 操作结果
   */
  M_VerifyUserData(handle, dataType, data) {
    this.ensureLoaded();
    return this.msdkLib.func("M_VerifyUserData", "int", ["int", "int", "string"])(handle, dataType, data);
  }
  /**
   * 检查盒子是否是可修改盒子
   * @param {number} handle 设备句柄
   * @returns {number} 检查结果 (1=可修改, 0=不可修改)
   */
  M_ChkSupportMdy(handle) {
    this.ensureLoaded();
    return this.msdkLib.func("M_ChkSupportMdy", "int", ["int"])(handle);
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
  M_SetNewVidPid(handle, vid1, pid1, vid2, pid2) {
    this.ensureLoaded();
    return this.msdkLib.func("M_SetNewVidPid", "int", ["int", "int", "int", "int", "int"])(
      handle,
      vid1,
      pid1,
      vid2,
      pid2
    );
  }
  /**
   * 复位盒子的 VID/PID，恢复成出厂设置
   *
   * 只支持可修改的单头、双头。普通单头、双头不支持
   * @param {number} handle 设备句柄
   * @returns {number} 操作结果
   */
  M_ResetVidPid(handle) {
    this.ensureLoaded();
    return this.msdkLib.func("M_ResetVidPid", "int", ["int"])(handle);
  }
  /**
   * 延时指定时间 time:单位 ms
   * @param {number} ms 延时时间(毫秒)
   * @returns {number} 操作结果
   */
  M_Delay(ms) {
    this.ensureLoaded();
    return this.msdkLib.func("M_Delay", "int", ["int"])(ms);
  }
  /**
   * 在指定的最小值和最大值之间延时随机时间 单位ms
   * @param {number} min 最小延时(毫秒)
   * @param {number} max 最大延时(毫秒)
   * @returns {number} 操作结果
   */
  M_DelayRandom(min, max) {
    this.ensureLoaded();
    return this.msdkLib.func("M_DelayRandom", "int", ["int", "int"])(min, max);
  }
  /**
   * 在最小值、最大值之间取随机数
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @returns {number} 随机数
   */
  M_RandDomNbr(min, max) {
    this.ensureLoaded();
    return this.msdkLib.func("M_RandDomNbr", "int", ["int", "int"])(min, max);
  }
  /**
   * DLL 内部参数恢复默认值
   * @param {number} handle 设备句柄
   * @returns {number} 操作结果
   */
  M_InitParam(handle) {
    this.ensureLoaded();
    return this.msdkLib.func("M_InitParam", "int", ["int"])(handle);
  }
  /**
   * 设置 DLL 内部参数
   * @param {number} handle 设备句柄
   * @param {number} paramType 参数类型
   * @param {number} paramValue 参数值
   * @param {number} reserved 保留参数
   * @returns {number} 操作结果
   */
  M_SetParam(handle, paramType, paramValue, reserved) {
    this.ensureLoaded();
    return this.msdkLib.func("M_SetParam", "int", ["int", "int", "int", "int"])(
      handle,
      paramType,
      paramValue,
      reserved
    );
  }
  /**
   * 单击(按下后立刻弹起)指定按键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @param {number} delayMs 按下后延时(毫秒)
   * @returns {number} 操作结果
   */
  M_KeyPress(handle, keyCode, delayMs) {
    this.ensureLoaded();
    return this.msdkLib.func("M_KeyPress", "int", ["int", "int", "int"])(
      handle,
      keyCode,
      delayMs
    );
  }
  /**
   * 按下指定按键不弹起，如果按下不弹起，可以和其他按键组成组合键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 操作结果
   */
  M_KeyDown(handle, keyCode) {
    this.ensureLoaded();
    return this.msdkLib.func("M_KeyDown", "int", ["int", "int"])(
      handle,
      keyCode
    );
  }
  /**
   * 弹起指定按键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 操作结果
   */
  M_KeyUp(handle, keyCode) {
    this.ensureLoaded();
    return this.msdkLib.func("M_KeyUp", "int", ["int", "int"])(
      handle,
      keyCode
    );
  }
  /**
   * 读取按键状态；返回值：0=弹起状态；1:=按下状态
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 按键状态
   */
  M_KeyState(handle, keyCode) {
    this.ensureLoaded();
    return this.msdkLib.func("M_KeyState", "int", ["int", "int"])(
      handle,
      keyCode
    );
  }
  /**
   * 单击(按下后立刻弹起)指定按键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @param {number} delayMs 按下后延时(毫秒)
   * @returns {number} 操作结果
   */
  M_KeyPress2(handle, keyCode, delayMs) {
    this.ensureLoaded();
    return this.msdkLib.func("M_KeyPress2", "int", ["int", "int", "int"])(
      handle,
      keyCode,
      delayMs
    );
  }
  /**
   * 按下指定按键不弹起，如果按下不弹起，可以和其他按键组成组合键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 操作结果
   */
  M_KeyDown2(handle, keyCode) {
    this.ensureLoaded();
    return this.msdkLib.func("M_KeyDown2", "int", ["int", "int"])(
      handle,
      keyCode
    );
  }
  /**
   * 弹起指定按键
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 操作结果
   */
  M_KeyUp2(handle, keyCode) {
    this.ensureLoaded();
    return this.msdkLib.func("M_KeyUp2", "int", ["int", "int"])(
      handle,
      keyCode
    );
  }
  /**
   * 读取按键状态；返回值：0=弹起状态；1:=按下状态
   * @param {number} handle 设备句柄
   * @param {number} keyCode 按键代码
   * @returns {number} 按键状态
   */
  M_KeyState2(handle, keyCode) {
    this.ensureLoaded();
    return this.msdkLib.func("M_KeyState2", "int", ["int", "int"])(
      handle,
      keyCode
    );
  }
  // --------------------------
  // 私有方法
  // --------------------------
  async initialize(customPath) {
    try {
      const dllPath = customPath || (0, import_node_path.resolve)(__dirname, "./dll/msdk_64.dll");
      this.msdkLib = import_koffi.default.load(dllPath);
      this.loaded = true;
    } catch (error) {
      throw new Error(`\u52A0\u8F7D DLL \u5931\u8D25: ${error.message}`);
    }
  }
  ensureLoaded() {
    if (!this.loaded) {
      throw new Error("MSDK DLL \u672A\u52A0\u8F7D\uFF0C\u8BF7\u5148\u8C03\u7528 load() \u65B9\u6CD5");
    }
  }
};
_MsdkController.instance = null;
var MsdkController = _MsdkController;
async function withMsdk(callback, dllPath) {
  const msdk = await MsdkController.load(dllPath);
  try {
    return await callback(msdk);
  } finally {
    try {
      await msdk.unload();
    } catch (error) {
      console.error("\u5378\u8F7D MSDK \u65F6\u51FA\u9519:", error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MsdkController,
  withMsdk
});
