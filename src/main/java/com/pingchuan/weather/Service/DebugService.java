package com.pingchuan.weather.Service;

import com.pingchuan.weather.DTO.SearchResultDTO;
import com.pingchuan.weather.Domain.ElementInfo;

import java.util.List;
import java.util.Map;

public interface DebugService {

    SearchResultDTO GetPointValue(String URL, String requestMode, Map<String, Object> map);

    SearchResultDTO GetLineValues(String url, String requestMode, Map<String,Object> stringObjectMap);

    SearchResultDTO GetRegionValues(String url, String requestMode, Map<String,Object> stringObjectMap);

    SearchResultDTO GetModeCodeValues(String url, String requestMode, Map<String,Object> stringObjectMap);

    SearchResultDTO GetElementCodeByModeCode(String modeCode, String method);

    SearchResultDTO GetRegionValuesToArray(String url, String requestMode, Map<String,Object> stringObjectMap);

    SearchResultDTO getBoxDiagram(String url, String requestMode, Map<String,Object> boxDiagramParamter);

    SearchResultDTO DisplayIsobars(String url, String requestMode, Map<String,Object> stringObjectMap);

    SearchResultDTO getWeatherPhenomenon(String url, String requestMode, Map<String,Object> weatherPhenomenonParamter);


    // SearchResultDTO GetRegionValuesToArray(String url, String requestMode, Map<String,Object> stringObjectMap);

}
