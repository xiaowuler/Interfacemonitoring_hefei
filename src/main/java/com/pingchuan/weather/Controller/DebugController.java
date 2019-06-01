package com.pingchuan.weather.Controller;

import com.pingchuan.weather.Domain.SearchResultInfo;
import com.pingchuan.weather.Domain.SearchResultInfos;
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
    public SearchResultInfo GetPointValue(String URL, String requestMode, String modeCode, String elementCode, float latitude, float longitude, int forecastLevel, String forecastTime, String initialTime){
        return debugService.GetPointValue(URL, requestMode, GetPointValueParam(modeCode, elementCode, latitude, longitude, forecastLevel, forecastTime, initialTime));
    }

    @RequestMapping("/GetLineValues")
    public void GetLineValues(String URL, String requestMode, String modeCode, String elementCode, float latitude, float longitude, int forecastLevel, String startTime, String endTime, String initialTime){
        SearchResultInfos searchResultInfo = debugService.GetLineValues(URL, requestMode, GetLineValuesParam(modeCode, elementCode, latitude, longitude, forecastLevel, startTime, endTime, initialTime));
    }

    @RequestMapping("/GetRegionValues")
    public void GetRegionValues(String URL, String requestMode, String modeCode, String elementCode, float minLat, float maxLat, float minLon, float maxLon, int forecastLevel, String forecastTime, String initialTime){
        SearchResultInfo searchResultInfo = debugService.GetRegionValues(URL, requestMode, GetRegionValuesParam(modeCode, elementCode, minLat, maxLat, minLon, maxLon, forecastLevel, forecastTime, initialTime));
    }

    private Map<String,Object> GetRegionValuesParam(String modeCode, String elementCode, float minLat, float maxLat, float minLon, float maxLon, int forecastLevel, String forecastTime, String initialTime) {
        Map<String, Object> map = new HashMap<>();
        map.put("ModeCode", modeCode);
        map.put("ElementCode", elementCode);
        map.put("MinLat", minLat);
        map.put("MaxLat", maxLat);
        map.put("MinLon", minLon);
        map.put("MaxLon", maxLon);
        map.put("ForecastLevel", forecastLevel);
        map.put("ForecastTime", forecastTime);

        String params;
        if (!"".equals(initialTime))
        {
            map.put("InitialTime", initialTime);
            params = String.format("ModeCode=%s&ElementCode=%s&MinLat=%s&MaxLat=%s&MinLon=%s&MaxLon=%s&ForecastLevel=%s&ForecastTime=%s&InitialTime=%s&CallerCode=%s&SecretKey=%s", modeCode, elementCode, minLat, maxLat, minLon, maxLon, forecastLevel, forecastTime, initialTime, "SC002", "1495fe15a4994bc58c42124a3ab8e7d9");

        }else {
            params = String.format("ModeCode=%s&ElementCode=%s&MinLat=%s&MaxLat=%s&MinLon=%s&MaxLon=%s&ForecastLevel=%s&ForecastTime=%s&CallerCode=%s&SecretKey=%s", modeCode, elementCode, minLat, maxLat, minLon, maxLon, forecastLevel, forecastTime, "SC002", "1495fe15a4994bc58c42124a3ab8e7d9");
        }

        String signCode = MD5Util.MD5(params);
        map.put("CallerCode", "SC002");
        map.put("SignCode", signCode);

        return map;
    }

    private Map<String, Object> GetLineValuesParam(String modeCode, String elementCode, float latitude, float longitude, int forecastLevel, String startTime, String endTime, String initialTime){
        Map<String, Object> map = new HashMap<>();
        map.put("ModeCode", modeCode);
        map.put("ElementCode", elementCode);
        map.put("Latitude", latitude);
        map.put("Longitude", longitude);
        map.put("ForecastLevel", forecastLevel);
        map.put("StartTime", startTime);
        map.put("EndTime", endTime);

        String params;
        if (!"".equals(initialTime))
        {
            map.put("InitialTime", initialTime);
            params = String.format("ModeCode=%s&ElementCode=%s&Latitude=%s&Longitude=%s&ForecastLevel=%s&StartTime=%s&EndTime=%s&InitialTime=%s&CallerCode=%s&SecretKey=%s", modeCode, elementCode, latitude, longitude, forecastLevel, startTime, endTime, initialTime, "SC002", "1495fe15a4994bc58c42124a3ab8e7d9");

        }else {
            params = String.format("ModeCode=%s&ElementCode=%s&Latitude=%s&Longitude=%s&ForecastLevel=%s&StartTime=%s&EndTime=%s&CallerCode=%s&SecretKey=%s", modeCode, elementCode, latitude, longitude, forecastLevel, startTime, endTime, "SC002", "1495fe15a4994bc58c42124a3ab8e7d9");
        }

        String signCode = MD5Util.MD5(params);
        map.put("CallerCode", "SC002");
        map.put("SignCode", signCode);

        return map;
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
