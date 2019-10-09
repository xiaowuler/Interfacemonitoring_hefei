package com.pingchuan.weather.Domain;

import lombok.Data;

import java.util.List;

@Data
public class ContourData {

    private int error;

    private String message;

    private List<List<ElementRegionValue>> data;
}
