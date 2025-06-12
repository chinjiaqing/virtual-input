// eslint-disable-next-line antfu/no-import-dist
import { MsdkController } from '../dist/index.js'

// 改进的延迟函数，添加错误处理
const delay = timeout => new Promise(resolve => {
  const timer = setTimeout(resolve, timeout);
  // 添加清理逻辑防止内存泄漏
  const cleanup = () => {
    clearTimeout(timer);
    process.off('beforeExit', cleanup);
  };
  process.on('beforeExit', cleanup);
});

async function main() {
  let msdk;
  let handle = -1;
  
  console.log('测试开始...');
  
  try {
    // 1. 加载 DLL
    console.log('加载 DLL...');
    msdk = await MsdkController.load();
    
    // 2. 打开设备
    console.log('打开设备...');
    handle = msdk.M_Open(1);
    console.log('设备句柄:', handle);
    
    // 验证句柄有效性
    if (handle <= 0) {
      throw new Error(`无效的设备句柄: ${handle}`);
    }
    
    // 3. 获取设备序列号（使用正确的方式）
    console.log('获取设备序列号...');
    const bufSize = 64;
    // 分配缓冲区并填充零
    const buffer = Buffer.alloc(bufSize, 0);
    const result = msdk.M_GetDevSn(handle, bufSize, buffer);
    
    if (result === 0) {
      // 正确解码缓冲区内容
      const serial = buffer.toString('utf8').replace(/\0/g, '');
      console.log('序列号获取成功:', serial);
    } else {
      console.warn('序列号获取失败，错误码:', result);
    }
    
    // 4. 模拟按键操作（添加延迟确保执行）
    const keyCode = 65; // A 键
    console.log('模拟按键操作...');
    
    console.log('按下 A 键');
    msdk.M_KeyDown(handle, keyCode);
    await delay(500); // 等待500ms
    
    console.log('释放 A 键');
    msdk.M_KeyUp(handle, keyCode);
    await delay(500); // 等待500ms
    
    // 5. 关闭设备
    console.log('关闭设备...');
    const closeResult = msdk.M_Close(handle);
    handle = -1; // 标记为已关闭
    console.log('关闭结果:', closeResult === 0 ? '成功' : '失败');
    
    // 6. 卸载 DLL
    console.log('卸载 DLL...');
    await msdk.unload();
    msdk = null;
    
    console.log('测试完成');
    
  } catch (error) {
    console.error('发生错误:', error);
  } finally {
    // 确保资源清理
    if (handle > 0 && msdk) {
      try {
        console.log('强制关闭设备...');
        msdk.M_Close(handle);
      } catch (err) {
        console.error('关闭设备时出错:', err);
      }
    }
    
    if (msdk) {
      try {
        console.log('强制卸载 DLL...');
        await msdk.unload();
      } catch (err) {
        console.error('卸载 DLL 时出错:', err);
      }
    }
  }
}

// 启动主函数并处理退出
main()
  .then(() => {
    console.log('程序将在3秒后退出...');
    // 防止立即退出
    setTimeout(() => process.exit(0), 3000);
  })
  .catch(err => {
    console.error('主函数异常:', err);
    process.exit(1);
  });

// 保持进程运行
process.stdin.resume();