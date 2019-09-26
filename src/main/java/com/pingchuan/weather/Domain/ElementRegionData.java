package com.pingchuan.weather.Domain;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ElementRegionData {

    private Date Id;

    private Date forecastTime;

    private List<ElementRegionValue> values;
}
