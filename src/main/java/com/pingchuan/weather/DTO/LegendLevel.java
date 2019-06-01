package com.pingchuan.weather.DTO;

import lombok.Data;

/**
 * @description: 温度色标
 * @author: XW
 * @create: 2019-06-01 15:05
 **/

@Data
public class LegendLevel {
    public Integer Level_id;
    public double BeginValue;
    public double EndValue;
    public String Color;
    public String Text;
    public String type;
}
