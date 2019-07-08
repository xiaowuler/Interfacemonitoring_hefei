package com.pingchuan.weather.Service;

import com.pingchuan.weather.DTO.SearchResultDTO;
import com.pingchuan.weather.Domain.ProductType;

import java.util.List;
import java.util.Map;

public interface DebugService {

    SearchResultDTO GetPointValue(String URL, String requestMode, Map<String, Object> map);

    SearchResultDTO GetLineValues(String url, String requestMode, Map<String,Object> stringObjectMap);

    SearchResultDTO GetRegionValues(String url, String requestMode, Map<String,Object> stringObjectMap);

    Map<String, List<ProductType>> GetElementCodesByModeCode();

    SearchResultDTO GetElementCodeByModeCode(String modeCode, String method);

    SearchResultDTO GetRegionValuesToArray(String url, String requestMode, Map<String,Object> stringObjectMap);
}
