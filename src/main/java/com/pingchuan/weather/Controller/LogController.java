package com.pingchuan.weather.Controller;

import com.github.pagehelper.PageInfo;

import com.pingchuan.weather.DTO.LogDTO;
import com.pingchuan.weather.Model.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pingchuan.weather.Model.Log;
import com.pingchuan.weather.Service.LogService;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/log")
public class LogController{

    @Autowired
    private LogService logService;
    
    @RequestMapping("/insert")
    public void insert(Log log){
        logService.insert(log);
    }
    
    @RequestMapping("/delete")
    public void delete(Log log){
        logService.delete(log);
    }
    
    @RequestMapping("/updateById")
    public void updateById(Log log){
        logService.updateById(log);
    }

    //首页接口信息分页
    @RequestMapping("/findAllByPage")
    public PageResult<Log> findAllByPage(int page, int rows){
        return logService.findAllByPage(page, rows);
    }

    //首页折线图
    @RequestMapping("/findAllByDate")
    public List<LogDTO> findAllByDate(){
        return logService.findAllByDate();
    }

    @RequestMapping("/findAllByState")
    public PageResult<LogDTO> findAllByState(int page, int rows){
        return logService.findAllByState(page, rows);
    }

    @RequestMapping("/findAllCheckInfo")
    public List<Log> findAllCheckInfo(){
        return logService.findAllLogName();
    }

    @RequestMapping("/findAllByCallerAndNameAndStateAndTime")
    public PageResult<LogDTO> findAllByCallerAndNameAndStateAndTime(String name, String callerCode, Date startTime, Date endTime, int state, int page, int rows){
        return logService.findAllByCallerAndNameAndStateAndTime(name, callerCode, startTime, endTime, state, page, rows);
    }
}
