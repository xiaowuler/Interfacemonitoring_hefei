package com.pingchuan.weather.Domain;

import lombok.Data;

/**
 * @description: 调用接口返回的结果类
 * @author: XW
 * @create: 2019-05-31 16:28
 **/

@Data
public class SearchResultInfo {
    private int Error;
    private String Message;
    private Object Data;
}
