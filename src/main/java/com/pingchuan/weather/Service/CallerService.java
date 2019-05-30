package com.pingchuan.weather.Service;

import com.pingchuan.weather.Model.Caller;
import com.github.pagehelper.PageInfo;

import java.util.List;


public interface CallerService{

    void insert(Caller caller);
    
    void delete(Caller caller);
    
    void updateById(Caller caller);
    
    PageInfo<Caller> findAllByPage(int pageNum, int pageSize);

    List<Caller> findAllByEnable();

    void insertOne(String name, String code, String key, byte enable);
}