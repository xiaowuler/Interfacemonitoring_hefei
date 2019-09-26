package com.pingchuan.weather.Domain;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ElementLineData {

    private Long Id;

    private BigDecimal lon;

    private BigDecimal lat;

    private List<ElementLineValue> values;
}
