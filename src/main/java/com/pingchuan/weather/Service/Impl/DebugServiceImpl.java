package com.pingchuan.weather.Service.Impl;

import com.alibaba.fastjson.JSONObject;
import com.pingchuan.weather.Domain.SearchResultInfo;
import com.pingchuan.weather.Service.DebugService;
import com.pingchuan.weather.Util.WebUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
    public SearchResultInfo GetPointValue(String URL, String requestMode, Map<String, Object> map) {
        if (requestMode.equals("POST")){
            String result = WebUtil.Post(URL, map);

            if (!StringUtils.isEmpty(result)){
                SearchResultInfo searchResultInfo = JSONObject.parseObject(result, SearchResultInfo.class);
                System.out.println(searchResultInfo);
            }
        }

        return null;
    }
}
