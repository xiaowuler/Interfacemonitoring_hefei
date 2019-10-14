package com.pingchuan.weather.Domain;

import lombok.Data;

import java.util.List;

@Data
public class WeatherPhenomenonResultInfo {

    private int error;

    private String message;

    private WeatherPhenomenon data;
}
