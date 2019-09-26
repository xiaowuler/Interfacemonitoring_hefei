package com.pingchuan.weather.Domain;

import cn.hutool.core.date.DateTime;
import lombok.Data;

import java.util.List;

/**
 * @description: 查询接口元素类
 * @author: XW
 * @create: 2019-05-31 16:30
 **/

@Data
public class Element {

    private ElementInfo elementInfo;

    private ElementPointData elementPointData;

    private ElementLineData elementLineData;

    private ElementRegionData elementRegionData;
}
