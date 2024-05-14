import axios, { AxiosResponse } from "axios";
import { blobToStr, isNull, isObject } from "../utils";
import { message } from "antd";

/**
 * 接口超时时间
 */
export const getTimeout = () => 3000;

/**
 * api请求地址
 */
export const getBaseUrl = () => process.env.VUE_APP_API_PREFIX;

/**
 * axios访问实例
 */
export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: getTimeout(),
});

/**
 * http请求参数
 */
export interface IHttpRequestParams {
  // 请求地址
  url: string;

  // 请求数据, 如需上传文件，此处为formdata
  data?: any;

  //请求方式, 默认post
  requestType?: "post" | "get";

  //数据类型  默认json
  dataType?: "json" | "form";

  //是否将参数格式化为formdata
  formatToFormData?: boolean;

  //请求异常的回调
  onError?: (msg: string) => void;

  //请求完毕的回调
  fin?: () => void;

  // 请求错误时是否显示提示信息，默认提示
  tipError?: boolean;

  // 响应数据类型
  responseType?: "json" | "blob";

  // 超时时长
  timeout?: number;
}

/**
 * 初始化参数
 */

const initHttpRequestParams = (params: IHttpRequestParams) => {
  if (isNull(params.requestType)) {
    params.requestType = "post";
  }

  if (isNull(params.dataType)) {
    params.dataType = "json";
  }

  if (isNull(params.tipError)) {
    params.tipError = true;
  }

  if (
    params.formatToFormData &&
    !isNull(params.data) &&
    isObject(params.data)
  ) {
    const formData = new FormData();
    for (const key in params.data) {
      if (Object.prototype.hasOwnProperty.call(params.data, key)) {
        const element = params.data[key];
        formData.append(key, element);
      }
    }
    params.data = formData;
  }
};

/**
 * 生成请求头
 * @param params
 */
const initHttpRequestHeader = (params: IHttpRequestParams) => {
  const header: any = {};

  if (params.requestType == "post") {
    header["Content-Type"] =
      params.dataType == "json"
        ? "application/json"
        : "application/x-www-form-urlencode";
  }

  /**
   * 如果需要token  在这里写
   * header['token'] = token
   */
  return header;
};

/**
 * 请求错误时进行提示
 */
const tipError = (
  isTip: boolean,
  msg: string,
  callback?: (msg: string) => void
) => {
  if (!isNull(msg) && msg.indexOf("timeout") !== -1) {
    msg = "请求超时";
    /**
     * reidrect('/login');
     */
  }
  callback?.(msg);
  if (!isTip) {
    return;
  }
  // 这里写如何提示错误信息
  message.error(msg);
};

/**
 * 通用的api请求 apiRequest
 */
export const apiRequest = async (params: IHttpRequestParams) => {
  if (isNull(params)) {
    return Promise.reject("请传入请求参数");
  }

  // 完善请求参数
  initHttpRequestParams(params);
  try {
    // 填充头部信息
    const headers = await initHttpRequestHeader(params);

    let response: AxiosResponse<any>;

    if (params.requestType == "post") {
      response = await axiosInstance.post("/api/" + params.url, params.data, {
        headers,
        timeout: params.timeout,
      });
    } else {
      response = await axiosInstance.get("/api/" + params.url, {
        headers,
        params: params.data,
        responseType: params.responseType,
        timeout: params.timeout,
      });
    }
    let rspData = response?.data;

    //返回的参数类型是blob或者真实的文件
    if (params.responseType === "blob") {
      if (response.headers["Content-Type"] === "application/json") {
        // 如果响应是json 代表出错
        try {
          const dataStr = await blobToStr(rspData as any);
          rspData = JSON.parse(dataStr);
        } catch (error) {
          rspData = { code: -1, msg: "未知的异常" };
        }
      }
    } else {
      // 这是真实的文件响应，返回固定的结果
      let fileName = params.data;
      // 读取文件名
      const fileContent = response.headers["content-disposition"];
      if (fileContent) {
        const start = fileContent.indexOf("fileName=");
        if (start !== -1) {
          const fileNameStr = fileContent.substring(start + 9);
          fileName = decodeURIComponent(fileNameStr);
        }
      }
      return Promise.resolve({ fileName, fileBlob: rspData });
    }

    const { code, data, msg } = rspData || {};
    if (code !== 200) {
      tipError(params.tipError!, msg, params.onError);
      return Promise.reject(msg);
    }
    return Promise.resolve(data);
  } catch (error: any) {
    tipError(params.tipError!, error?.message, params.onError);
    return Promise.reject(error);
  } finally {
    params.fin?.();
  }
};
