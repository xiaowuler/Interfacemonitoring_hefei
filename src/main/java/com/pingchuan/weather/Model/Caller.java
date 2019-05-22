package com.pingchuan.weather.Model;

import lombok.Data;

@Data
public class Caller {
    private String code;
    private String name;
    private String key;
    private Byte enabled;
}
