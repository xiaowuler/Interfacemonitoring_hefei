package com.pingchuan.weather.Domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class Weathers {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date date;

    private Prev12Hours prev12Hours;

    private Next12Hours next12Hours;

    private BigDecimal maxTmp;

    private BigDecimal minTmp;

    private List<Hours> hours;
}
