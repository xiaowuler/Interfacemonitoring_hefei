package com.pingchuan.weather.Service;

import com.pingchuan.weather.DTO.LogDTO;
import com.pingchuan.weather.Model.Log;
import com.github.pagehelper.PageInfo;
import com.pingchuan.weather.Model.PageResult;

import java.util.Date;
import java.util.List;
import java.util.Map;


public interface LogService{

    void insert(Log log);
    
    void delete(Log log);
    
    void updateById(Log log);

    PageResult<Log> findAllByPage(int pageNum, int pageSize);

    List<LogDTO> findAllByDate();

    PageResult<LogDTO> findAllByState(int pageNum, int pageSize);

    List<Log> findAllLogName();

    PageResult<LogDTO> findAllByCallerAndNameAndStateAndTime(String name, String callerId, Date startTime, Date endTime, int state, int pageNum, int pageSize);
}