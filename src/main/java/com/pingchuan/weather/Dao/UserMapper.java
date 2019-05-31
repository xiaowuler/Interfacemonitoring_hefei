package com.pingchuan.weather.Dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.pingchuan.weather.Model.User;

@Mapper
public interface UserMapper {

    void insert(User user);
    
    void delete(User user);
    
    void updateById(User user);
    
    List<User> findAll();

    User findOneById(int id);
}