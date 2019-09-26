package com.pingchuan.weather.DTO;

import com.pingchuan.weather.Domain.SearchResultInfo;
import com.pingchuan.weather.Domain.SearchResultInfos;
import lombok.Data;

/**
 * @description: 查询接口DTO
 * @author: XW
 * @create: 2019-06-01 09:18
 **/

@Data
public class SearchResultDTO {

    private String result;

    private SearchResultInfos searchResultInfos;

    private SearchResultInfo searchResultInfo;

   /* private SearchResultInfos searchResultInfos;*/

    private ContourResult contourResult;
}
