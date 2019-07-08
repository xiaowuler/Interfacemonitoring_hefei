package com.pingchuan.weather.Domain;

import lombok.Data;

/**
 * @description: 元素数组类
 * @author: XW
 * @create: 2019-07-08 13:39
 **/

@Data
public class ElementArray {
    //模式
    private String ModeCode ;

    //制作地区
    private String OrgCode ;

    //元素代码
    private String ElementCode ;

    //起报时间
    private String InitialTime ;

    //预报间隔时次
    private long ForecastTimeLength ;

    //预报最大时效
    private long ForecastPeriods ;

    //预报层次
    private int ForecastLevel ;

    private float StartLatitude;

    private float StartLongitude;

    private int LatitudeLength;

    private int LongitudeLength;

    public float[] Array ;

    public float[] UArray ;

    public float[] VArray ;

}
