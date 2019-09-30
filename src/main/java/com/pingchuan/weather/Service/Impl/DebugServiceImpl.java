package com.pingchuan.weather.Service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.pingchuan.weather.DTO.ContourResult;
import com.pingchuan.weather.DTO.LegendLevel;
import com.pingchuan.weather.DTO.SearchResultDTO;
import com.pingchuan.weather.DTO.ValuePoint;
import com.pingchuan.weather.Dao.LegendLevelMapper;
import com.pingchuan.weather.Domain.*;
import com.pingchuan.weather.Service.DebugService;
import com.pingchuan.weather.Util.ContourUtil;
import com.pingchuan.weather.Util.WebUtil;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.text.ParseException;
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
            SearchResultInfo searchResultInfo = JSONObject.parseObject(result, SearchResultInfo.class);;
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

        //searchResultDTO.setResult(result);
        searchResultDTO.setSearchResultInfos(searchResultInfos);
        List<LegendLevel> legendLevels = legendLevelMapper.findAll("temperatures");
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
    public Map<String, List<String>> GetElementInfosByModeCode(String url, String requestMode, Map<String,Object> stringObjectMap){
        Map<String, List<String>> map=new HashMap<>();
        List<String> listInitialTime = new ArrayList<String>();
        List<String> listElementCode = new ArrayList<String>();
        List<String> listOrgCode = new ArrayList<String>();

        //SearchResultDTO searchResultDTO = new SearchResultDTO();
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy/MM/dd HH:mm");

            String result;
            if (requestMode.equals("POST"))
                result = WebUtil.Post(url, stringObjectMap);
            else
                result = WebUtil.Get(url, stringObjectMap);

            if (StringUtils.isEmpty(result))
                return null;

        SearchResultInfo searchResultInfo = JSONObject.parseObject(result, SearchResultInfo.class);
        //searchResultDTO.setSearchResultInfo(searchResultInfo);

        Set set = new HashSet();
        for(ElementInfo elementInfo : searchResultInfo.getData()){
            if (set.add(elementInfo.getInitialTime()))
                listInitialTime.add(ft.format(elementInfo.getInitialTime()));
            if (set.add(elementInfo.getElementCode()))
                listElementCode.add(elementInfo.getElementCode());
            if (set.add(elementInfo.getOrgCode()))
                listOrgCode.add(elementInfo.getOrgCode());

        }
        Collections.sort(listInitialTime);
        map.put("initialTime",listInitialTime);
        map.put("elementCode",listElementCode);
        map.put("orgCode",listOrgCode);

        return map;
    }

    @Override
    public SearchResultDTO GetElementCodeByModeCode(String modeCode, String method) {
        return null;
    }

    @Override
    public SearchResultDTO GetRegionValuesToArray(String url, String requestMode, Map<String, Object> map) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(url, map);
        else
            result = WebUtil.Get(url, map);

        if (StringUtils.isEmpty(result))
            return searchResultDTO;
        else
            searchResultDTO.setResult(result);

        //SearchArrayResultInfo searchResultInfo = JSONObject.parseObject(result, SearchArrayResultInfo.class);
        /*if (!StringUtils.isEmpty(searchResultInfo.getMessage()) || searchResultInfo == null)
        {
            searchResultDTO.setSearchResultInfo(searchResultInfo);
            return searchResultDTO;
        }

        searchResultDTO.setResutl(result);
        searchResultDTO.setSearchResultInfo(searchResultInfo);

        List<LegendLevel> legendLevels = legendLevelMapper.findAll("temperatures");

        String productPath = ClassUtils.getDefaultClassLoader().getResource("").getPath();
        try {
            productPath = URLDecoder.decode(productPath, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        ContourUtil contourHelper = new ContourUtil(String.format("%s\\%s", productPath, "static/json/ah.json"));
        ContourResult contourResult = contourHelper.Calc(GetPoint(searchResultInfo.getData().get(0)), legendLevels, 8, -9999);
        searchResultDTO.setContourResult(contourResult);
*/
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
}
