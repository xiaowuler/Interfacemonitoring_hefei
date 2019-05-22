package com.pingchuan.weather.Controller;

import com.github.pagehelper.PageInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pingchuan.weather.Model.Log;
import com.pingchuan.weather.Service.LogService;

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
}
