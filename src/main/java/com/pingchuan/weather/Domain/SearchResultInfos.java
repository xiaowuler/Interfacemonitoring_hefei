package com.pingchuan.weather.Domain;

import lombok.Data;

import java.util.List;

/**
 * @description: 调用接口返回的结果类
 * @author: XW
 * @create: 2019-05-31 20:17
 **/

@Data
public class SearchResultInfos {
    private int Error;
    private String Message;
    private List<Element> Data;
}
