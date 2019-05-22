package com.pingchuan.weather.Service.Impl;

import java.util.List;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.PageHelper;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.pingchuan.weather.Model.Log;
import com.pingchuan.weather.Dao.LogMapper;
import com.pingchuan.weather.Service.LogService;

@Service
@Transactional
public class LogServiceImpl implements LogService{

    @Autowired
    private LogMapper logMapper;

    public void insert(Log log){
        logMapper.insert(log);
    }
    
    public void delete(Log log){
        logMapper.delete(log);
    }
    
    public void updateById(Log log){
        logMapper.updateById(log);
    }
    
    public PageInfo<Log> findAllByPage(int pageNum, int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        List<Log> logs = logMapper.findAll();
        return new PageInfo<>(logs);
    }
}