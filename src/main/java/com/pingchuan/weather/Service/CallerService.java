package com.pingchuan.weather.Service;

import com.pingchuan.weather.Model.Caller;
import com.github.pagehelper.PageInfo;


public interface CallerService{

    void insert(Caller caller);
    
    void delete(Caller caller);
    
    void updateById(Caller caller);
    
    PageInfo<Caller> findAllByPage(int pageNum, int pageSize);
}