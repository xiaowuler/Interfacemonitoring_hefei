package com.pingchuan.weather.DTO;

import lombok.Data;

import java.math.BigDecimal;

/**
 * @description: 点值
 * @author: XW
 * @create: 2019-06-01 15:11
 **/

@Data
public class ValuePoint {
    private BigDecimal Longitude;
    private BigDecimal Latitude;
    private BigDecimal Value;
    private String name;
    private String id;
    private Double averageDirection;
    private Double instantDirection;
}
