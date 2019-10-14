package com.pingchuan.weather.Domain;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class Prev12Hours {

    private String wea;

    private String windDirection;

    private BigDecimal windSpeed;

}
