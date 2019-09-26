package com.pingchuan.weather.Domain;

import lombok.Data;

import java.util.List;

@Data
public class SearchResultInfo {

    private int error;

    private String message;

    private List<ElementInfo> data;

}
