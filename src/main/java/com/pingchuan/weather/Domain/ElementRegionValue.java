package com.pingchuan.weather.Domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ElementRegionValue {

    private BigDecimal lon;

    private BigDecimal lat;

    private BigDecimal value;

    private BigDecimal uValue;

    private BigDecimal vValue;
}
