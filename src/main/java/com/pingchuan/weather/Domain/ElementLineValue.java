package com.pingchuan.weather.Domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class ElementLineValue {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date forecastTime;

    private BigDecimal value;

    private BigDecimal uValue;

    private BigDecimal vValue;
}
