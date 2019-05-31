package com.pingchuan.weather.Domain;

import cn.hutool.core.date.DateTime;
import lombok.Data;

import java.util.List;

/**
 * @description: 查询接口元素类
 * @author: XW
 * @create: 2019-05-31 16:30
 **/

@Data
public class Element {
    //模式
    private String ModeCode ;

    //制作地区
    private String OrgCode ;

    //元素代码
    private String ElementCode ;

    //作者
    private String Author ;

    //起报时间
    private String InitialTime ;

    //入库时间
    private String CreateTime ;

    //入库时间
    private String StorageTime ;

    private String ForecastTime ;

    //预报间隔时次
    private long ForecastTimeLength ;

    //预报最大时效
    private long ForecastPeriods ;

    //预报层次
    private int ForecastLevel ;

    private List<Grid> grids;
}
