package com.pingchuan.weather.Domain;

import lombok.Data;

/**
 * @description: 查询接口格点类
 * @author: XW
 * @create: 2019-05-31 16:33
 **/

@Data
public class Grid {

    private Float Value ;

    private Float UValue ;

    private Float VValue ;

    private float Longitude ;

    private float Latitude ;
}
