package com.pingchuan.weather.Controller;

import com.pingchuan.weather.DTO.SearchResultDTO;
import com.pingchuan.weather.Domain.ElementInfo;
import com.pingchuan.weather.Service.DebugService;
import com.pingchuan.weather.Util.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.xml.crypto.Data;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
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

    @RequestMapping("/GetElementCodeByModeCode")
    public SearchResultDTO GetElementCodeByModeCode(HttpServletRequest request, String modeCode){
        return debugService.GetElementCodeByModeCode(modeCode, request.getMethod());
    }

    @RequestMapping("/GetPointValue")
    public SearchResultDTO GetPointValue(String URL, String requestMode, String modeCode, String elementCode, BigDecimal lat, BigDecimal lon, String orgCode, Date forecastTime, Date initialTime){
        return debugService.GetPointValue(URL, requestMode, GetPointValueParam(modeCode, elementCode, lat, lon, orgCode, forecastTime, initialTime));
    }

    @RequestMapping("/GetLineValues")
    public SearchResultDTO GetLineValues(String URL, String requestMode, String modeCode, String elementCode, BigDecimal lat, BigDecimal lon, String orgCode, Date startForecastTime, Date endForecastTime, Date initialTime){
        return debugService.GetLineValues(URL, requestMode, GetLineValuesParam(modeCode, elementCode, lat, lon, orgCode, startForecastTime,endForecastTime, initialTime));
    }

    @RequestMapping("/GetRegionValues")
    public SearchResultDTO GetRegionValues(String URL, String requestMode, String modeCode, String elementCode, BigDecimal startLon, BigDecimal endLon, BigDecimal startLat, BigDecimal endLat,String orgCode, Date forecastTime, Date initialTime){
        return debugService.GetRegionValues(URL, requestMode, GetRegionValuesParam(modeCode, elementCode, startLon, endLon, startLat, endLat, orgCode, forecastTime, initialTime));
    }

    @RequestMapping("/GetModeCodeValues")
    public SearchResultDTO GetModeCodeValues(String URL, String requestMode, String modeCode){
        return debugService.GetModeCodeValues(URL, requestMode, GetRegionModeCodeParam(modeCode));
    }

    @RequestMapping("/GetElementInfosByModeCode")
    public Map<String, List<String>> GetElementInfosByModeCode(String URL, String requestMode, String modeCode){
        return debugService.GetElementInfosByModeCode(URL, requestMode, GetRegionModeCodeParam(modeCode));
    }

    @RequestMapping("/getBoxDiagram")
    public SearchResultDTO getBoxDiagram(String url, String requestMode, BigDecimal lat, BigDecimal lon, Date startForecastTime, Date endForecastTime, Date initialTime){
        return debugService.getBoxDiagram(url, requestMode, getBoxDiagramParamter(lat, lon, startForecastTime, endForecastTime, initialTime));
    }

    private Map<String, Object> getBoxDiagramParamter(BigDecimal lat, BigDecimal lon, Date startForecastTime, Date endForecastTime, Date initialTime){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat ("yyyy-MM-dd HH:mm:ss");

        Map<String, Object> map = new HashMap<>();
        map.put("modeCode", "ec_ens");
        map.put("elementCode", "pph");
        map.put("lon", lon);
        map.put("lat", lat);
        map.put("startForecastTime", simpleDateFormat.format(startForecastTime));
        map.put("endForecastTime", simpleDateFormat.format(endForecastTime));
        map.put("initialTime", simpleDateFormat.format(initialTime));
        map.put("callerCode", "sc002");

        return map;
    }

    /*   @RequestMapping("/GetRegionValuesToArray")
    public SearchResultDTO GetRegionValuesToArray(String URL, String requestMode, String modeCode, String elementCode, float minLat, float maxLat, float minLon, float maxLon, int forecastLevel, String forecastTime, String initialTime){
        return  debugService.GetRegionValuesToArray(URL, requestMode, GetRegionValuesParam(modeCode, elementCode, minLat, maxLat, minLon, maxLon, forecastLevel, forecastTime, initialTime));
    }*/

    /*@RequestMapping("/GetElementCodesByModeCode")
    public Map<String, List<ProductType>> GetElementCodesByModeCode(){
        return debugService.GetElementCodesByModeCode();
    }*/

    private Map<String,Object> GetRegionValuesParam(String modeCode, String elementCode, BigDecimal startLon, BigDecimal endLon, BigDecimal startLat, BigDecimal endLat, String orgCode, Date forecastTime, Date initialTime) {
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd HH:mm:ss");
        Map<String, Object> map = new HashMap<>();
        map.put("modeCode", modeCode);
        map.put("elementCode", elementCode);
        map.put("startLat", startLat);
        map.put("endLat", endLat);
        map.put("startLon", startLon);
        map.put("endLon", endLon);
        map.put("orgCode", orgCode);
        map.put("forecastTime", ft.format(forecastTime));
        map.put("initialTime",ft.format(initialTime));
        return map;
    }

    private Map<String, Object> GetLineValuesParam(String modeCode, String elementCode, BigDecimal lat, BigDecimal lon, String orgCode , Date startForecastTime , Date endForecastTime , Date initialTime){
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd HH:mm:ss");
        Map<String, Object> map = new HashMap<>();
        map.put("modeCode", modeCode);
        map.put("elementCode", elementCode);
        map.put("lat", lat);
        map.put("lon", lon);
        map.put("orgCode", orgCode);
        map.put("startForecastTime", ft.format(startForecastTime));
        map.put("endForecastTime",ft.format(endForecastTime));
        map.put("initialTime",ft.format(initialTime));
        return map;
    }

    private Map<String, Object> GetPointValueParam(String modeCode, String elementCode, BigDecimal lat, BigDecimal lon, String orgCode, Date forecastTime, Date initialTime){
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd HH:mm:ss");
        Map<String, Object> map = new HashMap<>();
        map.put("modeCode", modeCode);
        map.put("elementCode", elementCode);
        map.put("lat", lat);
        map.put("lon", lon);
        map.put("orgCode", orgCode);
        map.put("forecastTime", ft.format(forecastTime));
        map.put("initialTime",ft.format(initialTime));
        return map;
    }

    private Map<String,Object> GetRegionModeCodeParam(String modeCode) {
        Map<String, Object> map = new HashMap<>();
        map.put("modeCode", modeCode);
        return map;
    }
}
