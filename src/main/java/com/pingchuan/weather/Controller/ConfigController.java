package com.pingchuan.weather.Controller;

import com.github.pagehelper.PageInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pingchuan.weather.Model.Config;
import com.pingchuan.weather.Service.ConfigService;

@RestController
@RequestMapping("/config")
public class ConfigController{

    @Autowired
    private ConfigService configService;
    
    @RequestMapping("/insert")
    public void insert(Config config){
        configService.insert(config);
    }
    
    @RequestMapping("/delete")
    public void delete(Config config){
        configService.delete(config);
    }
    
    @RequestMapping("/updateById")
    public void updateById(Config config){
        configService.updateById(config);
    }
    
    @RequestMapping("/findAllByPage")
    public PageInfo<Config> findAllByPage(int pageNum, int pageSize){
        return configService.findAllByPage(pageNum, pageSize);
    }
}
