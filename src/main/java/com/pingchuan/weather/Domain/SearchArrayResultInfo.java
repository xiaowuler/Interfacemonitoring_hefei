package com.pingchuan.weather.Domain;

import lombok.Data;

import java.util.List;

/**
 * @description: 查询结果返回类
 * @author: XW
 * @create: 2019-07-08 13:38
 **/

@Data
public class SearchArrayResultInfo {
    private int Error;
    private String Message;
    private List<ElementArray> Data;
}
