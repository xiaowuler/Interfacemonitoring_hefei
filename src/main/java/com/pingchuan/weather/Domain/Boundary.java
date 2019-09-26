package com.pingchuan.weather.Domain;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class Boundary {

    private BigDecimal left;

    private BigDecimal right;

    private BigDecimal top;

    private BigDecimal bottom;
}
