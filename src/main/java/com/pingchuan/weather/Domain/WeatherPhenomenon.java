package com.pingchuan.weather.Domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class WeatherPhenomenon {


    private BigDecimal lon;

    private BigDecimal lat;

    private List<Weathers> weathers;
}
