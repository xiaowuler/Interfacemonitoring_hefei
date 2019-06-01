package com.pingchuan.weather.DTO;

import lombok.Data;

/**
 * @description: 点值
 * @author: XW
 * @create: 2019-06-01 15:11
 **/

@Data
public class ValuePoint {
    private double Longitude;
    private double Latitude;
    private double Value;
    private String name;
    private String id;
    private Double averageDirection;
    private Double instantDirection;
}
