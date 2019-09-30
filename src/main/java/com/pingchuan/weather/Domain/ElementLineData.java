package com.pingchuan.weather.Domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ElementLineData {

    private Long Id;

    private BigDecimal lon;

    private BigDecimal lat;

    private List<ElementLineValue> values;
}
