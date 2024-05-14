/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-constant-condition */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";  

/**
 * 检测对象是否为空
 * @param {*} e 入参
 * @returns 如果对象为空，返回true
 */
export const isNull = (e: any) => {
  //基础情况
  if (e === null || e === undefined) {
    return true;
  }
  //空字符串情况  
  if (e === '') {
    return true;
  }
  //对象情况
  if (e.toString() === "[object Object]" && JSON.stringify(e) === '{}') {
    return true;
  }
  return false;
}
/**
 * mm转换为px
 * @param value
 * @returns {number}
 */
export function mmConversionPx(value: number) {
  var inch = value / 25.4;
  var c_value = inch * 72 * 1.5;
  //console.log(c_value);
  return c_value;
}

/**
 * 要检测的数组对象
 * @param e 入参
 * @returns 如果数组为空或者长度小于等于0，返回true
 */
export const isNullArray = (e: any) => isNull(e) || e.length <= 0;

/**
 * 是否是对象
 */
export const isObject = (e: any) => {
  if (isNull(e)) {
    return false;
  }
  return e.toString() === "[object Object]";
}

/**
 * 生成GUID
 */
export const newGuid = () => {
  var curguid = "";
  for (var i = 1; i <= 32; i++) {
    var id = Math.floor(Math.random() * 16.0).toString(16);
    curguid += id;
    if (i === 8 || i === 12 || i === 16 || i === 20) curguid += "";
  }
  return curguid;
};


/**
 * 用setTimeout实现轮询
 * @param fn 需要执行的函数
 * @param count 执行次数
 * @param millisec 间隔时间 毫秒
 */
export const playTimeSet = (fn: () => void, count: number, millisec: number): void => {
  const interval = () => {
    if (typeof count === 'undefined' || count-- > 0) {
      setTimeout(interval, millisec);
      try {
        fn();
      } catch (e:any) {
        count = 0;
        throw e.toString();
      }
    }
  };
  setTimeout(interval, millisec);
}

/**
 * 对象数组相关操作
 */
export const arrayObjectUtils = {
  /**
   * 内容替换
   * @param array 原数组
   * @param replaceItem 要替换的新对象
   * @param propName 对象主键属性名
   * @returns 替换完成后的数组内容
   */
  replace: (array: object[], replaceItem: any, propName: string): any[] => {
    if (isNullArray(array) || isNull(propName)) {
      return array;
    }
    let rst: any[] = [...array];
    var hitIndex = rst.findIndex(m => !isNull(m) && m[propName] == replaceItem[propName]);
    if (hitIndex < 0) {
      return rst;
    }
    rst.splice(hitIndex, 1, replaceItem);
    return rst;
  },
  /**
   * 对象数组去重
   * @param array 
   * @param idPropName 
   */
  distinct(array: object[], idPropName: string) {
    if (isNullArray(array) || isNull(idPropName)) {
      return array;
    }
    var rst: any[] = [];
    var idValues: any[] = [];
    array.forEach((item: any) => {
      if (isNull(item)) {
        return;
      }
      if (idValues.find(m => m === item[idPropName])) {
        return;
      }
      idValues.push(item[idPropName]);
      rst.push(item);
    });
    return rst;
  }
}

/**
 * 常规数组相关操作
 */
export const arrayUtil = {
  /**
   * 元素上移
   * @param items 原数组
   * @param index 当前坐标
   * @returns 上移一格后的新数组
   */
  moveUp: (items: any[], index: number) => {
    if (isNullArray(items) || index == 0) {
      return items;
    }
    return [...items.slice(0, index - 1), items[index], items[index - 1], ...items.slice(index + 1)]
  },
  /**
   * 元素下移
   * @param items 原数组
   * @param index 当前坐标
   * @returns 下移一格后的新数组
   */
  moveDown: (items: any[], index: number) => {
    if (isNullArray(items) || index == items.length - 1) {
      return items;
    }
    return [...items.slice(0, index), items[index + 1], items[index], ...items.slice(index + 2)]
  },
  /**
   * 删除元素
   * @param items 原数组
   * @param index 要删除元素的下标
   * @returns 删除指定下标位置元素后的新数组
   */
  delete: (items: any[], index: number) => {
    if (isNullArray(items) || index < 0 || index > items.length - 1) {
      return items;
    }
    return [...items.slice(0, index), ...items.slice(index + 1)]
  },
  /**
   * 更新下标位置的元素
   * @param items 原数组
   * @param index 下标
   * @param item 新元素
   * @returns 更新后的数组
   */
  update: (items: any[], index: number, item: any) => {
    if (isNullArray(items) || index < 0 || index > items.length - 1) {
      return items;
    }
    return [...items.slice(0, index), item, ...items.slice(index + 1)]
  },
  /**
   * 向指定下标插入元素
   * @param items 
   * @param index 
   * @param item 
   * @returns 
   */
  insert: (items: any[], index: number, item: any) => {
    if (isNullArray(items) || index < 0 || index > items.length - 1) {
      return items;
    }
    if (index == -1) {
      return [...items, item];
    }
    return [...items.slice(0, index), item, ...items.slice(index)]
  },
  /**
   * 数组去重
   * @param arr 
   * @returns 
   */
  distinct: (arr: any[]) => {
    if (isNullArray(arr)) {
      return arr;
    }
    return Array.from(new Set(arr))
  }
}

/**
 * 添加PNG格式的base64前缀
 * @param str
 */
export const addPNGBase64Prefix = (str: any) => `data:image/png;base64,${str}`;


/**
 * 以moment实现的时间格式化
 * @param time 
 * @param formartter 
 */
export const momentFormat = (time: any, formartter: string = 'YYYY-MM-DD HH:mm:ss') => {
  if (isNull(time)) {
    return '';
  }
  return moment(time).format(formartter);
}

/**
 * 将unixtime时间戳格式化
 * @param unixtime 
 * @param formartter 
 */
export const unixtimeFormat = (unixtime: string | number, formartter: string = 'YYYY-MM-DD HH:mm:ss') => {
  if (isNull(unixtime)) {
    return '';
  }
  var number = 0;
  try {
    number = parseInt(unixtime.toString());
  } catch (error) {
    return ''
  }
  return moment(number).format(formartter);
}

/**
 * 将时间转为unxitime时间戳
 * @param time 
 */
export const toUnixtime = (time: any, format: 'second' | 'millisecond') => {
  if (isNull(time)) {
    return '';
  }
  var formartter = 'X';
  if (format === 'millisecond') {
    formartter = 'x';
  }
  return moment(time).format(formartter);
}

/**
 * 检测字符串是否以指定内容开头
 * @param {string} start 要检测开头的内容
 * @param {string} str 要检测的字符串
 * @returns
 */
export const startWith = (start: string, str: string) => new RegExp("^" + start).test(str);

/**
 * 移除对象中的空元素 没有递归，只有第一层
 * @param obj
 */
export const removeNullAttribute = (obj: any) => {
  let rst: any = {};
  if (isNull(obj)) {
    return rst;
  }
  for (var key in obj) {
    if (!isNull(obj[key])) {
      rst[key] = obj[key];
    }
  }
  return rst;
};

/**
 * 拿到base64图片的宽高 base64字符串需要带前缀
 */
export const getBase64ImgWH = (base64: any): Promise<{ width: number, height: number }> => {
  return new Promise<{ width: number, height: number }>((resovle, reject) => {
    try {
      var image = new Image();
      image.onload = () => {
        resovle({ width: image.width, height: image.height });
      };
      image.src = base64;
    } catch (error) {
      reject(error);
    }
  })
}

/**
 * 将枚举对象转换为Ant-Select可用Options
 * @param obj 
 * @returns 注意，这样转换出来的options value 是 string
 */
export const toAntSelectOptions = (obj: any) => {
  var list: any = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      list.push({ label: obj[key], value: key });
    }
  }
  return list;
}

/**
 * 检测对象是否是手机号
 * @param str 
 * @returns 如果是手机号则返回true
 */
export const isMobile = (str: any) => {
  if (isNull(str)) return false;
  const regex = /^1\d{10}$/;
  return str.toString().match(regex) != null;
}

/**
 * 正则检测
 * @returns 
 */
export const checkByRegex = (str: any, regex: RegExp) => new RegExp(regex).test(str?.toString());

/**
 * 考录空值的获取字符长度的方法
 * @param {string} str 要获取长度的字符串
 */
export const getStrLth = (str: string) => isNull(str) ? 0 : str.length;

/**
 * 检测对象是否是纯数字
 * @param input 
 * @returns 
 */
export const isNumber = (input: any) => {
  const regex = /^\d+$/g;
  if (`${input}`.match(regex)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 根据qq获取唤醒qq聊天窗口（与指定qq聊天的窗口）地址
 * @param qq 要联系的qq号
 * @returns 
 */
export const toAwakenQQContactLink = (qq: string) => `http://wpa.qq.com/msgrd?v=3&uin=${qq}&site=qq&menu=yes`;

/**
 *
 * blob二进制 to base64
 **/
export function blobToDataURI(blob: Blob): Promise<string> {
  return new Promise<string>((resovle, reject) => {
    try {
      var reader = new FileReader();
      reader.onload = function (e) {
        resovle(e.target!.result as any);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * base64转 二进制(blob)
 * @param dataurl 
 * @returns 
 */
export const base64ToBinary = async (dataurl: any) => {
  try {
    var bstr = atob(dataurl),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return Promise.resolve(new Blob([u8arr]));
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * blobtostr
 * @param blob 
 * @returns 
 */
export const blobToStr = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e:any) => {
      resolve(e.target.result as string);
    }
    reader.readAsText(blob, 'utf-8');
  });
}

export const base64ToBinarySync = (dataurl: any) => {
  try {
    var bstr = atob(dataurl),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr]);
  } catch (error) {
    return undefined;
  }
}


/**
 * 计算base64大小 异步
 * @param base64Str 
 * @param hasPrefix 
 */
export const getBase64Size = async (base64Str: string, hasPrefix: boolean): Promise<number> => {
  if (isNull(base64Str)) {
    return 0;
  }
  if (hasPrefix) {
    base64Str = base64Str.substring(base64Str.indexOf(',') + 1);
  }
  //查询最后一位，直到最后一位不是=
  while (true) {
    if (base64Str[base64Str.length - 1] === '=') {
      base64Str = base64Str.substring(0, base64Str.length - 1);
      continue;
    }
    break;
  }
  return Promise.resolve(base64Str.length - (base64Str.length / 8) * 2);
}

/**
 * 计算base64大小 同步
 * @param base64Str 
 * @param hasPrefix 
 */
export const getBase64SizeSync = (base64Str: string, hasPrefix: boolean): number => {
  if (isNull(base64Str)) {
    return 0;
  }
  if (hasPrefix) {
    base64Str = base64Str.substring(base64Str.indexOf(',') + 1);
  }
  //查询最后一位，直到最后一位不是=
  while (true) {
    if (base64Str[base64Str.length - 1] === '=') {
      base64Str = base64Str.substring(0, base64Str.length - 1);
      continue;
    }
    break;
  }
  return base64Str.length - (base64Str.length / 8) * 2;
}

/**
 * 去除base64的前缀
 */
export const removeBase64Prefix = (base64Str: string) => {
  if (isNull(base64Str)) {
    return "";
  }
  return base64Str = base64Str.substring(base64Str.indexOf(',') + 1);
}

/**
 * 拼接get参数
 * @param data 
 * @returns 
 */
export const assemblyGetParams = (data?: any) => {
  if (isNull(data)) {
    return '';
  }
  var rst = '?';
  for (var k in data) {
    if (!isNull(data[k])) {
      rst += `${k}=${data[k]}&`;
    }
  }
  if (rst === '?') {
    return ''
  }
  return rst.substring(0, rst.length - 1);
}


/**
 * 号码加*展示
 * @param phoneStr 
 * @returns 
 */
export const encryptionPhone = (phoneStr: string) => {
  if (isNull(phoneStr)) {
    return phoneStr;
  }
  if (phoneStr.length != 11 && phoneStr.length != 8 && phoneStr.length != 7) {
    return phoneStr;
  }
  if (phoneStr.length == 11) {
    return phoneStr.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  } else if (phoneStr.length == 8) {
    return phoneStr.replace(/(\d{2})\d{3}(\d{3})/, "$1***$2");
  } else {
    return phoneStr.replace(/(\d{1})\d{3}(\d{3})/, "$1***$2");
  }
}

/**
 * 反转字符串
 */
export const reverseStr = (str: string): string => {
  if (isNull(str)) {
    return str;
  }
  var chars = str.split("");
  var left = 0;
  var right = chars.length - 1;
  while (left < right) {
    var temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;
    left++;
    right--;
  }
  return chars.join("");
}

/**
 * 获取url地址对象
 * @param url 
 */
export const getUrlParams = (url: string): any => {
  var quersionIndex = url.indexOf("?");
  if (quersionIndex === -1) {
    return {};
  }
  var rsp:any = {}
  var searchStr = url.substring(quersionIndex + 1);
  var params = searchStr.split('&');
  for (var i = 0; i < params.length; i++) {
    var kv = params[i].split('=');
    if (kv.length === 2) {
      rsp[kv[0]] = kv[1];
    }
  }
  return rsp;
}



/**
 * 数据加密 (sm4)
 * @param data 
 * @returns 
*/
export const encryptionStr = (data: string) => {
  const SM4 = require("gm-crypt").sm4;
  var sm4Config = {
    //配置sm4参数
    key: "0123456789ABCDEF",//这里这个key值是跟后端要的
    mode: "ecb", // 加密的方式有两种，ecb和cbc两种，也是看后端如何定义的，不过要是cbc的话下面还要加一个iv的参数，ecb不用
    cipherType: "base64" // 
  };
  var sm4 = new SM4(sm4Config);
  return sm4.encrypt(data);
}

/**
 * 数据加密 (md5)
 * @param data 
 * @returns 加密后的数据
 */
export const encryptionMd5 = (data:string)=>{
  const md5 = require('js-md5')
  return md5(data)
}

/**
 * 加密身份证号
 */
export const encryptionIdCard = (idCard: string) => {
  if (isNull(idCard) || idCard.length < 8) { // 长度太短，无法加密
    return idCard;
  }
  //获取身份证号中间需要替换为星号的部分起始位置和长度
  var start = Math.floor((idCard.length - 8) / 2); // 起始位置
  var len = 8; // 需要替换的部分长度
  //构造替换后的字符串
  var encryptedIdCard = idCard.substring(0, start) + '********' + idCard.substring(start + len);
  return encryptedIdCard;
}

/**
 * 加密地址
 */
export const encryptionAddress = (address: string) => {
  if (isNull(address) || address.length == 1) {
    return address;
  }

  // 获取地址中需要替换为星号的部分起始位置和长度
  var start = 1;
  var len = address.length / 2;

  // 非空格字符替换为*
  var asterisk = '';
  for (var i = 0; i < len; i++) {
    asterisk += '*';
  }
  var encryptedAddress = address.substring(0, start) + asterisk + address.substring(start + len);

  return encryptedAddress;
}

/**
 * 加密邮箱
 */
export const encryptionEmail = (email: string) => {
  if (isNull(email)) {
    return email;
  }
  var parts = email.split("@");
  if (parts.length != 2) {
    return email;
  }
  var username = parts[0];
  var domain = parts[1];
  if (username.length < 3) {
    return email;
  }
  var encryptUsername = username.substring(0, 3) + "****" + username.substring(username.length - 2);
  var encryptEmail = encryptUsername + "@" + domain;
  return encryptEmail;
}

// a标签下载函数
export const aDownloadFun = (id: string, name: string) => {
  const newDown = document.createElement('a')
  newDown.href = `http://192.168.100.141:8089/downloadZone/download?id=${id}`
  newDown.style.display = 'none'
  newDown.download = name //文件名
  newDown.click()  //触发点击
  URL.revokeObjectURL(newDown.href)  //释放url
}