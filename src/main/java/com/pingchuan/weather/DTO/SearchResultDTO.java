package com.pingchuan.weather.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.pingchuan.weather.Domain.BoxDiagramResultInfo;
import com.pingchuan.weather.Domain.ContourData;
import com.pingchuan.weather.Domain.SearchResultInfo;
import com.pingchuan.weather.Domain.SearchResultInfos;
import lombok.Data;

/**
 * @description: 查询接口DTO
 * @author: XW
 * @create: 2019-06-01 09:18
 **/

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchResultDTO {

    private String result;

    private SearchResultInfos searchResultInfos;

    private SearchResultInfo searchResultInfo;

    private ContourResult contourResult;

    private String picUrl;

    private ContourData contourData;

    private BoxDiagramResultInfo boxDiagramResultInfo;
}
