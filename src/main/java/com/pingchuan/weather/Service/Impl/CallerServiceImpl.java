package com.pingchuan.weather.Service.Impl;

import java.util.ArrayList;
import java.util.List;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.PageHelper;

import com.pingchuan.weather.Model.PageResult;
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

    @Override
    public void delete(Caller caller) {
        callerMapper.delete(caller);
    }

    public void delete(String code){
        Caller caller = callerMapper.findOneById(code);
        if (caller == null)
            return;
        callerMapper.delete(caller);
    }
    
    public void updateById(Caller caller){
        callerMapper.updateById(caller);
    }
    
    public PageResult<Caller> findAllByPage(int pageNum, int pageSize){
        int count = callerMapper.findAll(0, 0).size();
        List<Caller> callers = callerMapper.findAll((pageNum - 1) * pageSize, pageSize);
        return new PageResult<>(count, callers);
    }

    @Override
    public List<Caller> findAllByEnable() {
        ArrayList<Caller> callers =  (ArrayList<Caller>) callerMapper.findAll(0, 0);
        Caller caller = new Caller();
        caller.setName("全部");
        caller.setCode("-1");
        callers.add(0, caller);
        return callers;
    }

    @Override
    public void insertOne(String name, String code, String key, byte enable) {
        Caller caller = new Caller();
        caller.setCode(code);
        caller.setName(name);
        caller.setKey(key);
        caller.setEnabled(enable);
        callerMapper.insert(caller);
    }

    @Override
    public void update(String name, String code, String key, byte enable) {
        Caller caller = new Caller();
        caller.setCode(code);
        caller.setName(name);
        caller.setKey(key);
        caller.setEnabled(enable);
        callerMapper.updateById(caller);
    }
}