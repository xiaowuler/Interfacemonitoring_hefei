package com.pingchuan.weather.Model;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Log {
    private int id;
    private String name;
    private String params;
    private String caller;
    private Byte isSuccess;
    private String errorMessage;
    private Long startTime;
    private Long endTime;
    private String reserved1;
    private String reserved2;
    private String reserved3;
}
