package com.pingchuan.weather.Service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.pingchuan.weather.DTO.*;
import com.pingchuan.weather.Dao.LegendLevelMapper;
import com.pingchuan.weather.Domain.*;
import com.pingchuan.weather.Service.DebugService;
import com.pingchuan.weather.Util.ContourUtil;
import com.pingchuan.weather.Util.WebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import javax.net.ssl.SSLServerSocket;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @description: 接口调试实现
 * @author: XW
 * @create: 2019-05-31 16:52
 **/

@Service
@Transactional
public class DebugServiceImpl implements DebugService {

    @Autowired
    private LegendLevelMapper legendLevelMapper;


    @Override
    public SearchResultDTO GetModeCodeValues(String url, String requestMode, Map<String, Object> stringObjectMap) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(url, stringObjectMap);
        else
            result = WebUtil.Get(url, stringObjectMap);
        if (!StringUtils.isEmpty(result)){
                // searchResultDTO.setResult(result);
            SearchResultInfo searchResultInfo = JSONObject.parseObject(result, SearchResultInfo.class);
            searchResultDTO.setSearchResultInfo(searchResultInfo);
        }
        return searchResultDTO;
    }

    @Override
    //获取点的值
    public SearchResultDTO GetPointValue(String URL, String requestMode, Map<String, Object> map) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(URL, map);
        else
            result = WebUtil.Get(URL, map);
        if (!StringUtils.isEmpty(result)){
           // searchResultDTO.setResult(result);
            SearchResultInfos searchResultInfos = JSONObject.parseObject(result, SearchResultInfos.class);
            searchResultDTO.setSearchResultInfos(searchResultInfos);
        }
        return searchResultDTO;
    }

    @Override
    //获取线的值
    public SearchResultDTO GetLineValues(String url, String requestMode, Map<String, Object> map) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(url, map);
        else
            result = WebUtil.Get(url, map);

        if(!StringUtils.isEmpty(result)){
            SearchResultInfos searchResultInfos = JSONObject.parseObject(result, SearchResultInfos.class);
            searchResultDTO.setSearchResultInfos(searchResultInfos);
        }
        return searchResultDTO;
    }

    @Override
    //获取面的值
    public SearchResultDTO GetRegionValues(String url, String requestMode, Map<String, Object> stringObjectMap) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(url, stringObjectMap);
        else
            result = WebUtil.Get(url, stringObjectMap);

        if (StringUtils.isEmpty(result))
            return searchResultDTO;

        SearchResultInfos searchResultInfos = JSONObject.parseObject(result, SearchResultInfos.class);
        if (!StringUtils.isEmpty(searchResultInfos.getMessage()) || searchResultInfos.getData() == null)
        {
            searchResultDTO.setSearchResultInfos(searchResultInfos);
            return searchResultDTO;
        }

        searchResultDTO.setSearchResultInfos(searchResultInfos);
        List<LegendLevel> legendLevels = legendLevelMapper.findAll("IsobaricLine");
        String productPath = ClassUtils.getDefaultClassLoader().getResource("").getPath();
        try {
            productPath = URLDecoder.decode(productPath, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        ContourUtil contourHelper = new ContourUtil(String.format("%s\\%s", productPath, "static/json/ah.json"));

        if (searchResultInfos.getData().getElementRegionData().getValues().size() == 0)
            return searchResultDTO;

        ContourResult contourResult = contourHelper.Calc(GetPoint(searchResultInfos.getData()/*.get(0)*/), legendLevels, 8, -9999);
        searchResultDTO.setContourResult(contourResult);

        return searchResultDTO;
    }


    @Override
    public SearchResultDTO GetElementCodeByModeCode(String modeCode, String method) {
        return null;
    }

    @Override
    public SearchResultDTO GetRegionValuesToArray(String url, String requestMode, Map<String, Object> stringObjectMap) {
        return null;
    }

    @Override
    public SearchResultDTO DisplayIsobars(String url, String requestMode, Map<String, Object> stringObjectMap) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        Map<String, List<Double>> map=new HashMap<>();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(url, stringObjectMap);
        else
            result = WebUtil.Get(url, stringObjectMap);

        if (StringUtils.isEmpty(result))
            return null;

        ContourData contourData = JSONObject.parseObject(result, ContourData.class);
        for(List<ElementRegionValue> valueList : contourData.getData()){
           for (ElementRegionValue value : valueList){
               String key = value.getLon() + "-" + value.getLat();
               if (map.containsKey(key))
               {
                   map.get(key).add(value.getValue().doubleValue());
                   continue;
               }

               List<Double> values = new ArrayList<>();
               values.add(value.getValue().doubleValue());
               map.put(key, values);
           }
        }
        List<ValuePoints> valuePoints = new ArrayList<>();
        for(String key:map.keySet()){
            String[] locs = key.split("-");
            ValuePoints valuePoint = new ValuePoints();
            valuePoint.setLongitude(Double.parseDouble(locs[0]));
            valuePoint.setLatitude(Double.parseDouble(locs[1]));
            valuePoint.setValue(Calc(map.get(key)));
            valuePoints.add(valuePoint);
        }

        List<LegendLevel> legendLevels = legendLevelMapper.findAll("IsobaricLine");
        String productPath = ClassUtils.getDefaultClassLoader().getResource("").getPath();
        try {
            productPath = URLDecoder.decode(productPath, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        ContourUtil contourHelper = new ContourUtil(String.format("%s\\%s", productPath, "static/json/ah.json"));

        if (valuePoints.size() == 0)
            return null;

        ContourResult contourResult = contourHelper.Calcs(valuePoints/*.get(0)*/,legendLevels, 8, -9999);
        searchResultDTO.setContourResult(contourResult);
        searchResultDTO.setContourData(contourData);
        return searchResultDTO;
    }

    @Override
    public SearchResultDTO getWeatherPhenomenon(String url, String requestMode, Map<String, Object> weatherPhenomenonParamter) {
        SearchResultDTO searchResultDTO=new SearchResultDTO();
        String result;
        if(requestMode.equals("POST"))
            result=WebUtil.Post(url,weatherPhenomenonParamter);
        else
            result=WebUtil.Get(url,weatherPhenomenonParamter);

        if(StringUtils.isEmpty(result))
            return searchResultDTO;

        WeatherPhenomenonResultInfo weatherPhenomenonResultInfo=JSONObject.parseObject(result,WeatherPhenomenonResultInfo.class);
        searchResultDTO.setWeatherPhenomenonResultInfo(weatherPhenomenonResultInfo);

        return searchResultDTO;
    }

    @Override
    public SearchResultDTO getBoxDiagram(String url, String requestMode, Map<String, Object> boxDiagramParamter) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(url, boxDiagramParamter);
        else
            result = WebUtil.Get(url, boxDiagramParamter);

        if (StringUtils.isEmpty(result))
            return searchResultDTO;
        /*else
            searchResultDTO.setResult(result);*/

        BoxDiagramResultInfo boxDiagramResultInfo = JSONObject.parseObject(result, BoxDiagramResultInfo.class);
        searchResultDTO.setBoxDiagramResultInfo(boxDiagramResultInfo);
        if (boxDiagramResultInfo.getError() == 0)
            searchResultDTO.setPicUrl(boxDiagramResultInfo.getData());
        return searchResultDTO;
    }


    private List<ValuePoint> GetPoint(Element element){

        List<ValuePoint> valuePoints = new ArrayList<>();
        ValuePoint valuePoint;
        if ("EDA10".equals(element.getElementInfo().getElementCode())){
            valuePoint = new ValuePoint();
            for(ElementRegionValue regionValue:element.getElementRegionData().getValues()) {
                valuePoint.setLatitude(regionValue.getLat());
                valuePoint.setLongitude(regionValue.getLon());
                valuePoint.setValue(regionValue.getValue());
                valuePoints.add(valuePoint);
            }
        }else if ("TMP".equals(element.getElementInfo().getElementCode())){
            BigDecimal bigDecimal = new BigDecimal(Double.valueOf(273.15));
            valuePoint = new ValuePoint();
            for(ElementRegionValue regionValue:element.getElementRegionData().getValues()) {
                valuePoint.setLatitude(regionValue.getLat());
                valuePoint.setLongitude(regionValue.getLon());
                valuePoint.setValue(regionValue.getValue().subtract(bigDecimal));
                valuePoints.add(valuePoint);
                }
        }else {
            valuePoint = new ValuePoint();
            for(ElementRegionValue regionValue:element.getElementRegionData().getValues()) {
                valuePoint.setLatitude(regionValue.getLat());
                valuePoint.setLongitude(regionValue.getLon());
                valuePoint.setValue(regionValue.getValue());
                valuePoints.add(valuePoint);
            }
        }
        return valuePoints;
    }
    //算法
    public double Calc(List<Double> values)
    {
        double average = GetAverage(values);

        double sum = 0;
        for (double value : values)
        sum += Math.pow(average - value, 2);

        return Math.sqrt(sum / values.size());
    }

    private double GetAverage(List<Double> values)
    {
        double sum = 0;
        for (Double value : values)
        sum += value;
        return sum / values.size();
    }
}
