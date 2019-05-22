package com.pingchuan.weather.Service;

import com.pingchuan.weather.Model.User;
import com.github.pagehelper.PageInfo;


public interface UserService{

    void insert(User user);
    
    void delete(User user);
    
    void updateById(User user);
    
    PageInfo<User> findAllByPage(int pageNum, int pageSize);
}