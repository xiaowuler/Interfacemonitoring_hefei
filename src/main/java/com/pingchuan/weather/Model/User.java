package com.pingchuan.weather.Model;

import lombok.Data;

@Data
public class User {
    private int id;
    private String name;
    private String password;
    private Byte enabled;
}
