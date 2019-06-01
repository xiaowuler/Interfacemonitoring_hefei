package com.pingchuan.weather.Service.Impl;

import java.util.List;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.PageHelper;

import com.pingchuan.weather.Model.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.pingchuan.weather.Model.User;
import com.pingchuan.weather.Dao.UserMapper;
import com.pingchuan.weather.Service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService{

    @Autowired
    private UserMapper userMapper;

    public void insert(User user){
        userMapper.insert(user);
    }
    
    public void delete(User user){
        userMapper.delete(user);
    }
    
    public void updateById(User user){
        userMapper.updateById(user);
    }
    
    public PageResult<User> findAllByPage(int pageNum, int pageSize){
        List<User> users = userMapper.findAll();
        int count = users.size();
        int startIndex = (pageNum - 1) * pageSize;
        int endIndex = pageSize * pageNum >= count ? count : pageSize * pageNum;
        return new PageResult<>(count, users.subList(startIndex, endIndex));
    }

    @Override
    public User findOneById(int id) {
        return userMapper.findOneById(id);
    }
}