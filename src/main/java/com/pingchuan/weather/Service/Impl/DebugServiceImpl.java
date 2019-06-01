package com.pingchuan.weather.Service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.pingchuan.weather.DTO.ContourResult;
import com.pingchuan.weather.DTO.LegendLevel;
import com.pingchuan.weather.DTO.SearchResultDTO;
import com.pingchuan.weather.DTO.ValuePoint;
import com.pingchuan.weather.Dao.LegendLevelMapper;
import com.pingchuan.weather.Domain.Element;
import com.pingchuan.weather.Domain.Grid;
import com.pingchuan.weather.Domain.SearchResultInfo;
import com.pingchuan.weather.Domain.SearchResultInfos;
import com.pingchuan.weather.Service.DebugService;
import com.pingchuan.weather.Util.ContourUtil;
import com.pingchuan.weather.Util.WebUtil;
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
        if (requestMode.equals("POST")){
            String result = WebUtil.Post(URL, map);

            if (!StringUtils.isEmpty(result)){
                SearchResultInfo searchResultInfo = JSONObject.parseObject(result, SearchResultInfo.class);
                searchResultDTO.setResutl(result);
                searchResultDTO.setSearchResultInfo(searchResultInfo);
                //System.out.println(searchResultInfo);
            }
        }

        return searchResultDTO;
    }

    @Override
    public SearchResultDTO GetLineValues(String url, String requestMode, Map<String, Object> map) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();

        if (requestMode.equals("POST")){
            String result = WebUtil.Post(url, map);

            if (!StringUtils.isEmpty(result)){
                SearchResultInfos searchResultInfos = JSONObject.parseObject(result, SearchResultInfos.class);
                searchResultDTO.setResutl(result);
                Collections.sort(searchResultInfos.getData(), new Comparator<Element>() {
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
        }
        return searchResultDTO;
    }

    @Override
    public SearchResultDTO GetRegionValues(String url, String requestMode, Map<String, Object> stringObjectMap) {
        SearchResultDTO searchResultDTO = new SearchResultDTO();
        if (requestMode.equals("POST")){
            String result = WebUtil.Post(url, stringObjectMap);

            if (StringUtils.isEmpty(result))
                return searchResultDTO;

            SearchResultInfo searchResultInfo = JSONObject.parseObject(result, SearchResultInfo.class);
            if (searchResultInfo == null)
                return searchResultDTO;

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
            ContourResult contourResult = contourHelper.Calc(GetPoint(searchResultInfo.getData()), legendLevels, 8, -9999);
            searchResultDTO.setContourResult(contourResult);
        }

        return searchResultDTO;
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
