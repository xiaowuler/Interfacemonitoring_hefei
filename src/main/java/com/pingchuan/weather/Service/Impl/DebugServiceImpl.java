package com.pingchuan.weather.Service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.pingchuan.weather.DTO.SearchResultDTO;
import com.pingchuan.weather.Domain.Element;
import com.pingchuan.weather.Domain.SearchResultInfo;
import com.pingchuan.weather.Domain.SearchResultInfos;
import com.pingchuan.weather.Service.DebugService;
import com.pingchuan.weather.Util.WebUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Map;

/**
 * @description: 接口调试实现
 * @author: XW
 * @create: 2019-05-31 16:52
 **/

@Service
@Transactional
public class DebugServiceImpl implements DebugService {

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
    public SearchResultInfo GetRegionValues(String url, String requestMode, Map<String, Object> stringObjectMap) {
        /*if (requestMode.equals("POST")){
            String result = WebUtil.Post(url, map);

            if (!StringUtils.isEmpty(result)){
                SearchResultInfo searchResultInfo = JSONObject.parseObject(result, SearchResultInfo.class);
                System.out.println(searchResultInfo);
            }
        }*/

        return null;
    }
}
