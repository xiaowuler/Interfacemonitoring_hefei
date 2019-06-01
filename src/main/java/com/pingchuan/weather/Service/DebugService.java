package com.pingchuan.weather.Service;

import com.pingchuan.weather.DTO.SearchResultDTO;
import com.pingchuan.weather.Domain.SearchResultInfo;
import com.pingchuan.weather.Domain.SearchResultInfos;

import java.util.Map;

public interface DebugService {

    SearchResultDTO GetPointValue(String URL, String requestMode, Map<String, Object> map);

    SearchResultDTO GetLineValues(String url, String requestMode, Map<String,Object> stringObjectMap);

    SearchResultInfo GetRegionValues(String url, String requestMode, Map<String,Object> stringObjectMap);
}
