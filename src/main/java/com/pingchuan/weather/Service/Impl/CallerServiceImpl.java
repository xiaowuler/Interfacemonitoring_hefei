package com.pingchuan.weather.Service.Impl;

import java.util.List;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.PageHelper;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.pingchuan.weather.Model.Caller;
import com.pingchuan.weather.Dao.CallerMapper;
import com.pingchuan.weather.Service.CallerService;

@Service
@Transactional
public class CallerServiceImpl implements CallerService{

    @Autowired
    private CallerMapper callerMapper;

    public void insert(Caller caller){
        callerMapper.insert(caller);
    }
    
    public void delete(Caller caller){
        callerMapper.delete(caller);
    }
    
    public void updateById(Caller caller){
        callerMapper.updateById(caller);
    }
    
    public PageInfo<Caller> findAllByPage(int pageNum, int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        List<Caller> callers = callerMapper.findAll();
        return new PageInfo<>(callers);
    }

    @Override
    public List<Caller> findAllByEnable() {
        return callerMapper.findAll();
    }
}