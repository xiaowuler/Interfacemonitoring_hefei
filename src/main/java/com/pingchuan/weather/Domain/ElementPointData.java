package com.pingchuan.weather.Domain;

import cn.hutool.core.date.DateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class ElementPointData {

    private BigDecimal lat;

    private BigDecimal lon;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date forecastTime;

    private List<ElementLineValue> values;
}
