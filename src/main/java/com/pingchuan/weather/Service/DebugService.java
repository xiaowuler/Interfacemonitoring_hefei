package com.pingchuan.weather.Service;

import com.pingchuan.weather.Domain.SearchResultInfo;
import com.pingchuan.weather.Domain.SearchResultInfos;

import java.util.Map;

public interface DebugService {

    SearchResultInfo GetPointValue(String URL, String RequestMode, Map<String, Object> map);

    SearchResultInfos GetLineValues(String url, String requestMode, Map<String,Object> stringObjectMap);

    SearchResultInfo GetRegionValues(String url, String requestMode, Map<String,Object> stringObjectMap);
}
