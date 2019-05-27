package com.pingchuan.weather.Controller;

import com.github.pagehelper.PageInfo;

import com.pingchuan.weather.DTO.LogDTO;
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
    
    @RequestMapping("/findAllByPage")
    public PageInfo<Log> findAllByPage(int pageNum, int pageSize){
        return logService.findAllByPage(pageNum, pageSize);
    }

    @RequestMapping("/findAllByDate")
    public List<LogDTO> findAllByDate(){
        return logService.findAllByDate();
    }

    @RequestMapping("/findAllByState")
    public PageInfo<LogDTO> findAllByState(int pageNum, int pageSize){
        return logService.findAllByState(pageNum, pageSize);
    }

    @RequestMapping("/findAllCheckInfo")
    public List<Log> findAllCheckInfo(){
        return logService.findAllLogName();
    }

    @RequestMapping("/findAllByCallerAndNameAndStateAndTime")
    public PageInfo<LogDTO> findAllByCallerAndNameAndStateAndTime(String name, int callerId, Date startTime, Date endTime, int state, int pageNum, int pageSize){
        return logService.findAllByCallerAndNameAndStateAndTime(name, callerId, startTime, endTime, state, pageNum, pageSize);
    }


}
