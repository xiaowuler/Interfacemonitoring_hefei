package com.pingchuan.weather.Domain;

import lombok.Data;


/**
 * @description: 箱线图 结果映射类
 * @author: XW
 * @create: 2019-10-09 09:55
 **/

@Data
public class BoxDiagramResultInfo {

    private int error;

    private String message;

    private String data;
}
