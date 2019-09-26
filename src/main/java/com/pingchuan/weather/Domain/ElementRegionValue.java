package com.pingchuan.weather.Domain;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ElementRegionValue {

    private BigDecimal lon;

    private BigDecimal lat;

    private BigDecimal value;

    private BigDecimal uValue;

    private BigDecimal vValue;
}
