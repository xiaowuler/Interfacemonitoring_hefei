package com.pingchuan.weather.DTO;

import lombok.Data;
import wContour.Global.Polygon;

import java.util.List;

/**
 * @description: 色斑图数据
 * @author: XW
 * @create: 2019-06-01 15:00
 **/

@Data
public class ContourResult<T> {

    public List<Polygon> spotPolygons;

    public List<LegendLevel> legendLevels;
}
