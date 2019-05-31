package com.pingchuan.weather.Service;

import com.pingchuan.weather.Domain.SearchResultInfo;

import java.util.Map;

public interface DebugService {

    SearchResultInfo GetPointValue(String URL, String RequestMode, Map<String, Object> map);
}
