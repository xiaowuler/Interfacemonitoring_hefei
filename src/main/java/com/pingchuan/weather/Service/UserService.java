package com.pingchuan.weather.Service;

import com.pingchuan.weather.Model.PageResult;
import com.pingchuan.weather.Model.User;
import com.github.pagehelper.PageInfo;


public interface UserService{

    void insert(User user);
    
    void delete(User user);
    
    void updateById(User user);

    PageResult<User> findAllByPage(int pageNum, int pageSize);

    User findOneById(int id);
}