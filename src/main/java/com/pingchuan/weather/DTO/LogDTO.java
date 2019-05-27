package com.pingchuan.weather.DTO;

import com.pingchuan.weather.Model.Log;
import lombok.Data;

import java.util.Date;

/**
 * @description: Log输出类
 * @author: XW
 * @create: 2019-05-26 16:46
 **/

@Data
public class LogDTO {

    //调用次数
    private int callNumber;

    //失败率
    private float failureRate;

    //平均耗时
    private float consumingAvg;

    //健康状态
    private float healthStatus;

    //本天调用次数
    private int callNumberDay;

    //成功率
    private float successRate;

    //成功平均耗时
    private float successConsumingAvg;

    //失败平均耗时
    private float failureConsumingAvg;

    private Date startTime;

    private Date endTime;

    private Log log;

    //耗时
    private long consumingTime;

    //调用者
    private String callerName;
}
