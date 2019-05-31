package com.pingchuan.weather.Controller;

import com.github.pagehelper.PageInfo;

import com.pingchuan.weather.Model.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pingchuan.weather.Model.User;
import com.pingchuan.weather.Service.UserService;

@RestController
@RequestMapping("/user")
public class UserController{

    @Autowired
    private UserService userService;
    
    @RequestMapping("/insert")
    public void insert(User user){
        userService.insert(user);
    }
    
    @RequestMapping("/delete")
    public void delete(User user){
        userService.delete(user);
    }
    
    @RequestMapping("/updateById")
    public void updateById(User user){
        userService.updateById(user);
    }
    
    @RequestMapping("/findAllByPage")
    public PageResult<User> findAllByPage(int pageNum, int pageSize){
        return userService.findAllByPage(pageNum, pageSize);
    }
}
