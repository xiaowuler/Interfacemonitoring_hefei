package com.pingchuan.weather.Util;

import cn.hutool.http.HttpRequest;

import java.util.Map;

/**
 * @description: 调用wpi工具类
 * @author: XW
 * @create: 2019-05-31 13:24
 **/
public class WebUtil {

    public static String Post(String URL, Map<String, Object> parameter){

        try{
            return HttpRequest.post(URL)
                    .form(parameter).timeout(20000).execute().body();
        }catch (Exception ex){
            return String.format("异常：{0}", ex.getMessage());
        }

    }

    public static String Get(String URL, Map<String, Object> parameter){

        try{
            return HttpRequest.get(URL)
                    .form(parameter).timeout(20000).execute().body();
        }catch (Exception ex){
            return String.format("异常：{0}", ex.getMessage());
        }

    }

}
