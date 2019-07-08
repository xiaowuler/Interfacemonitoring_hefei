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
    public SearchResultDTO GetPointValue(String URL, String requestMode, Map<String, Object> map) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(URL, map);
        else
            result = WebUtil.Get(URL, map);

        if (!StringUtils.isEmpty(result)){
            SearchResultInfo searchResultInfo = JSONObject.parseObject(result, SearchResultInfo.class);
            searchResultDTO.setResutl(result);
            searchResultDTO.setSearchResultInfo(searchResultInfo);
        }

        return searchResultDTO;
    }

    @Override
    public SearchResultDTO GetLineValues(String url, String requestMode, Map<String, Object> map) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(url, map);
        else
            result = WebUtil.Get(url, map);

        if (!StringUtils.isEmpty(result)){
            SearchResultInfos searchResultInfos = JSONObject.parseObject(result, SearchResultInfos.class);
            searchResultDTO.setResutl(result);
            List<Element> elements = GetAllElementForecastTime(searchResultInfos.getData());
            if (StringUtils.isEmpty(elements))
                return searchResultDTO;
            Collections.sort(elements, new Comparator<Element>() {
                @Override
                public int compare(Element o1, Element o2) {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    try {
                        Date o1Time = sdf.parse(o1.getForecastTime());
                        Date o2Time = sdf.parse(o2.getForecastTime());
                        return o1Time.compareTo(o2Time);
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }

                    return 1;
                }

                @Override
                public boolean equals(Object obj) {
                    return false;
                }
            });

            searchResultDTO.setSearchResultInfos(searchResultInfos);
        }
        return searchResultDTO;
    }

    private List<Element> GetAllElementForecastTime(List<Element> elements){
        List<Element> resElems = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for (Element element : elements){
            try {
                Date reportTime = sdf.parse(element.getInitialTime());
                element.setForecastTime(GetForecastTimeByReportTime(sdf, reportTime, (int)element.getForecastTimeLength()));
                resElems.add(element);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return resElems;
    }

    private String GetForecastTimeByReportTime(SimpleDateFormat sdf, Date reportTime, int addTimes){
        Calendar calendar =Calendar.getInstance();
        calendar.setTime(reportTime);
        calendar.add(Calendar.MINUTE, addTimes);
        return sdf.format(calendar.getTime());
    }

    @Override
    public SearchResultDTO GetRegionValues(String url, String requestMode, Map<String, Object> stringObjectMap) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        String result;
        if (requestMode.equals("POST"))
            result = WebUtil.Post(url, stringObjectMap);
        else
            result = WebUtil.Get(url, stringObjectMap);

        if (StringUtils.isEmpty(result))
            return searchResultDTO;

        SearchResultInfo searchResultInfo = JSONObject.parseObject(result, SearchResultInfo.class);
        if (!StringUtils.isEmpty(searchResultInfo.getMessage()) || searchResultInfo == null)
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

        return searchResultDTO;
    }

    @Override
    public Map<String, List<ProductType>> GetElementCodesByModeCode() {
        Map<String, List<ProductType>> map = new HashMap<>();
        String result = WebUtil.Post("10.129.4.202:9535/Search/GetElementCodeByModeCode", GetElementCodeByModeCodeParms("SPCC"));
        if (!StringUtils.isEmpty(result)) {
            ProductTypeResult productTypeResult = JSONObject.parseObject(result, ProductTypeResult.class);
            if (productTypeResult.getError() != 1)
                map.put("SPCC", productTypeResult.getData());
        }

        String resultOther = WebUtil.Post("10.129.4.202:9535/Search/GetElementCodeByModeCode", GetElementCodeByModeCodeParms("SCMOC"));
        if (!StringUtils.isEmpty(resultOther)) {
            ProductTypeResult productTypeResult = JSONObject.parseObject(resultOther, ProductTypeResult.class);
            if (productTypeResult.getError() != 1)
                map.put("SCMOC", productTypeResult.getData());
        }

        return map;
    }

    @Override
    public List<ProductType> GetElementCodeByModeCode(String modeCode, String method) {
        String result;
        if ("GET".equals(method))
            result = WebUtil.Get("10.129.4.202:9535/Search/GetElementCodeByModeCode", GetElementCodeByModeCodeParms(modeCode));
        else
            result = WebUtil.Post("10.129.4.202:9535/Search/GetElementCodeByModeCode", GetElementCodeByModeCodeParms(modeCode));

        if (!StringUtils.isEmpty(result)) {
            ProductTypeResult productTypeResult = JSONObject.parseObject(result, ProductTypeResult.class);
            if (productTypeResult.getError() != 1)
                return productTypeResult.getData();
        }
        return new ArrayList<>();
    }

    private Map<String, Object> GetElementCodeByModeCodeParms(String modeCode){
        Map<String, Object> map = new HashMap<>();
        map.put("ModeCode", modeCode);
        return map;
    }

    private List<ValuePoint> GetPoint(Element element){

        List<ValuePoint> valuePoints = new ArrayList<>();
        ValuePoint valuePoint;
        if ("EDA10".equals(element.getElementCode())){
            for (Grid grid : element.getGrids()){
                valuePoint = new ValuePoint();
                valuePoint.setLatitude(grid.getLatitude());
                valuePoint.setLongitude(grid.getLongitude());
                valuePoint.setValue(grid.getUValue());
                valuePoints.add(valuePoint);
            }
        }else if ("TMP".equals(element.getElementCode())){
            for (Grid grid : element.getGrids()){
                valuePoint = new ValuePoint();
                valuePoint.setLatitude(grid.getLatitude());
                valuePoint.setLongitude(grid.getLongitude());
                valuePoint.setValue(grid.getValue() - 273.15);
                valuePoints.add(valuePoint);
            }
        }else {
            for (Grid grid : element.getGrids()){
                valuePoint = new ValuePoint();
                valuePoint.setLatitude(grid.getLatitude());
                valuePoint.setLongitude(grid.getLongitude());
                valuePoint.setValue(grid.getValue());
                valuePoints.add(valuePoint);
            }
        }
        return valuePoints;
    }
}
