package com.pingchuan.weather.Domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

/**
 * @description: 查询接口元素类
 * @author: XW
 * @create: 2019-05-31 16:30
 **/

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Element {

    private ElementInfo elementInfo;

    private ElementPointData elementPointData;


    private ElementLineData elementLineData;


    private ElementRegionData elementRegionData;
}
