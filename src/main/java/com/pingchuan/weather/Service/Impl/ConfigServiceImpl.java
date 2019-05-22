package com.pingchuan.weather.Service.Impl;

import java.util.List;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.PageHelper;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.pingchuan.weather.Model.Config;
import com.pingchuan.weather.Dao.ConfigMapper;
import com.pingchuan.weather.Service.ConfigService;

@Service
@Transactional
public class ConfigServiceImpl implements ConfigService{

    @Autowired
    private ConfigMapper configMapper;

    public void insert(Config config){
        configMapper.insert(config);
    }
    
    public void delete(Config config){
        configMapper.delete(config);
    }
    
    public void updateById(Config config){
        configMapper.updateById(config);
    }
    
    public PageInfo<Config> findAllByPage(int pageNum, int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        List<Config> configs = configMapper.findAll();
        return new PageInfo<>(configs);
    }
}