package com.pingchuan.weather.Domain;

import lombok.Data;

import java.util.List;

/**
 * @description:
 * @author: XW
 * @create: 2019-06-17 09:54
 **/

@Data
public class ProductTypeResult {

    private int Error;

    private String Message;

    private List<ProductType> Data;

}
