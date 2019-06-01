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
    public void insert(String name, String password, Byte enabled){
        User user = new User();
        user.setEnabled(enabled);
        user.setName(name);
        user.setPassword(password);
        userService.insert(user);
    }
    
    @RequestMapping("/delete")
    public void delete(int id){
        User user = userService.findOneById(id);
        if (user == null)
            return;
        userService.delete(user);
    }
    
    @RequestMapping("/updateById")
    public void updateById(int id, String name, String password, Byte enabled){
        User user = new User();
        user.setId(id);
        user.setEnabled(enabled);
        user.setName(name);
        user.setPassword(password);
        userService.updateById(user);
    }
    
    @RequestMapping("/findAllByPage")
    public PageResult<User> findAllByPage(int page, int rows){
        return userService.findAllByPage(page, rows);
    }
}
