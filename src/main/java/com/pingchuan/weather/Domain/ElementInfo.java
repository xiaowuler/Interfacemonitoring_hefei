package com.pingchuan.weather.Domain;

import cn.hutool.core.date.DateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class ElementInfo {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date initialTime;

    private String modeCode;

    private String elementCode;

    private String orgCode;

    private Resolution resolution;

    private Boundary boundary;

    private double forecastLevel;

    private long forecastPeriods;

    private long forecastInterval;
}
