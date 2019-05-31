package com.pingchuan.weather.Controller;

import com.pingchuan.weather.Domain.SearchResultInfo;
import com.pingchuan.weather.Service.DebugService;
import com.pingchuan.weather.Util.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * @description: 接口调试控制器
 * @author: XW
 * @create: 2019-05-31 16:13
 **/

@RestController
@RequestMapping("/debug")
public class DebugController {

    @Autowired
    private DebugService debugService;

    @RequestMapping("/GetPointValue")
    public void GetPointValue(String URL, String RequestMode, String modeCode, String elementCode, float latitude, float longitude, int forecastLevel, String forecastTime, String initialTime){
        SearchResultInfo searchResultInfo = debugService.GetPointValue(URL, RequestMode, GetPointValueParam(modeCode, elementCode, latitude, longitude, forecastLevel, forecastTime, initialTime));
    }

    private Map<String, Object> GetPointValueParam(String modeCode, String elementCode, float latitude, float longitude, int forecastLevel, String forecastTime, String initialTime){
        Map<String, Object> map = new HashMap<>();
        map.put("ModeCode", modeCode);
        map.put("ElementCode", elementCode);
        map.put("Latitude", latitude);
        map.put("Longitude", longitude);
        map.put("ForecastLevel", forecastLevel);
        map.put("ForecastTime", forecastTime);

        String params;
        if (!"".equals(initialTime))
        {
            map.put("InitialTime", initialTime);
            params = String.format("ModeCode=%s&ElementCode=%s&Latitude=%s&Longitude=%s&ForecastLevel=%s&ForecastTime=%s&InitialTime=%s&CallerCode=%s&SecretKey=%s", modeCode, elementCode, latitude, longitude, forecastLevel, forecastTime, initialTime, "SC002", "1495fe15a4994bc58c42124a3ab8e7d9");

        }else {
            params = String.format("ModeCode=%s&ElementCode=%s&Latitude=%s&Longitude=%s&ForecastLevel=%s&ForecastTime=%s&CallerCode=%s&SecretKey=%s", modeCode, elementCode, latitude, longitude, forecastLevel, forecastTime, "SC002", "1495fe15a4994bc58c42124a3ab8e7d9");
        }

        String signCode = MD5Util.MD5(params);
        map.put("CallerCode", "SC002");
        map.put("SignCode", signCode);

        return map;
    }
}
